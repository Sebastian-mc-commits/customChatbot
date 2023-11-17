<?php
function getJson()
{
    $inputJSON = file_get_contents('php://input');

    return json_decode($inputJSON, true);
}

require_once "./model/ChatbotType.model.php";
require_once "./model/Response.php";
require_once "./model/ChatbotConfig.model.php";
require_once "./model/GlobalMethods.php";
require_once "./model/ResponseTitle.model.php";
require_once "./model/UserInput.model.php";

$requestType = $_GET["requestType"];
class Config
{
    use TraitMethods\GlobalMethods;

    private $chatbotConfigI;
    private $chatbotTypeI;
    private $responseI;
    private $responseTitleI;
    private $userInputI;

    public function __construct()
    {
        $this->chatbotConfigI = new ChatbotConfig\Model();
        $this->chatbotTypeI = new ChatbotType\Model();
        $this->responseI = new Response\Model();
        $this->responseTitleI = new ResponseTitle\Model();
        $this->userInputI = new UserInput\Model();
    }
    public function getChatBotAnswer()
    {
        [
            "chatBotType" => $chatbotType,
            "userQuestion" => $userQuestion,
            "chatBotTypeAvoid" => $chatBotTypeAvoid
        ] = $this->_filterExpectedValues(
            json_decode(getJson(), true),
            "chatBotType",
            "userQuestion",
            "chatBotTypeAvoid"
        );

        $answer = $this->chatbotConfigI->getAnswerByQuestionAndTypeId($chatbotType, $userQuestion, $chatBotTypeAvoid);
        return $this->convertToJson($answer);
    }

    public function getChatBotTypes()
    {
        return $this->convertToJson($this->chatbotTypeI->findAll());
    }

    public function getChatBotAnswerByTypeId()
    {

        $id = $_GET["id"];
        return $this->convertToJson($this->chatbotConfigI->findAll([
            "where" => [
                $this->chatbotConfigI->statements["TYPE_ID"] => [$id, "equal"]
            ]
        ]));
    }

    public function getAnswersByMainTree()
    {
        $id = $_GET["id"];
        $answer = $this->responseI->getResponsesByMainTree($id);
        return $this->convertToJson($answer);
    }

    public function getResponseById()
    {
        $id = $_GET["id"];

        $response = $this->responseI->findOne([
            "where" => [
                $this->responseI->statements["ID"] => [$id, "equal"]
            ]
        ]);

        return $response;
    }

    public function getResponseTitleById()
    {
        $id = $_GET["id"];

        return $this->responseTitleI->findOne([
            "where" => [
                $this->responseTitleI->statements["ID"] => [$id, "equal"]
            ]
        ]);
    }

    public function insertUserInputById()
    {
        [
            "responseId" => $responseId,
            "userInput" => $userInput,
        ] = $this->_filterExpectedValues(
            json_decode(getJson(), true),
            "responseId",
            "userInput",
        );

        return $this->userInputI->create([
            $this->userInputI->statements["INPUT_VALUE"] => $userInput,
            $this->userInputI->statements["RESPONSE_ID"] => $responseId
        ]);
    }

    private function convertToJson($dbValue)
    {
        $data = [];
        while ($row = $dbValue->fetch_assoc()) {
            $data[] = $row;
        }

        return $data;
    }
}

$instance = new Config();
$host = gethostname();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: $host");
echo json_encode(
    [
        "response" => call_user_func(array($instance, $requestType)),
    ]
);
exit();
