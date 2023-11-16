<?php

// require "config/database/init.php";
// 
// $requestType = $_GET["requestType"];
// $data = array();
// $connInstance = new InitDb();
// $conn = $connInstance->getConnection();
// 
// $type = "";
// $query = "";
// 
// function reducer($post)
// {
//     return [
//         "chatBotType" => function () use ($post) {
//             $chatBotType = $post["chatBotType"];
//             $userQuestion = $post["userQuestion"];
//             $getUserQuestion = getLike("cc.question", $userQuestion);
//             $naturalLanguage = "MATCH (cc.question) AGAINST('$userQuestion' IN NATURAL LANGUAGE MODE) > 0";
// 
//             return "SELECT * FROM chatbotconfig cc INNER JOIN chatbottype ct ON ct.id = cc.typeId WHERE cc.typeId = $chatBotType AND ($getUserQuestion) OR $naturalLanguage";
//         },
// 
//         "chatBotTypeAvoid" => function ($notResponse) {
//             $query = "";
// 
//             foreach ($notResponse as $element) {
//                 $query .= " AND cc.response NOT LIKE '%$element%'";
//             }
// 
//             return $query;
//         },
//     ];
// }
// 
// function getJson()
// {
//     $inputJSON = file_get_contents('php://input');
// 
//     return    json_decode($inputJSON, true);
// }
// 
// function getLike($row, $likeSentence)
// {
// 
//     return "$row LIKE '%$likeSentence%' OR $row LIKE '$likeSentence%'
//     OR $row LIKE '%$likeSentence' OR $row = '$likeSentence'";
// }
// 
// function removeLastWord($inputString)
// {
//     $wordsArray = explode(" ", $inputString);
//     array_pop($wordsArray);
// 
//     return implode(" ", $wordsArray);
// }
// 
// switch ($requestType) {
// 
//     case "getChatBotTypes":
//         $type = "response";
//         $query = "SELECT * FROM chatbottype";
//         break;
// 
//     case "getChatBotAnswer":
//         $type = "response";
//         $post = getJson();
// 
//         foreach ($post as $key => $value) {
// 
//             if (!array_key_exists($key, reducer($post))) {
//                 continue;
//             }
// 
//             $callback = reducer($post)[$key];
// 
//             $query .= $callback($value);
//         }
// 
//         $query = $query . " LIMIT 1";
// 
//         break;
// 
//     case "getChatBotAnswerById":
//         $id = $_GET["id"];
//         $type = "response";
//         $query = "SELECT * FROM chatbotconfig WHERE typeId = $id";
//         break;
// 
//     default:
//         http_response_code(400);
//         exit();
// }
// 
// if ($type == "response") {
//     $exec = $conn->query($query);
//     http_response_code(200);
//     while ($row = $exec->fetch_assoc()) {
//         $data[] = $row;
//     }
// }
// 
// $host = "*";
// header("Content-Type: application/json");
// header("Access-Control-Allow-Origin: $host");
// echo json_encode(
//     [
//         "response" => $data,
//         "h" => "Hello",
//         "query" => $query,
//         "post" => getJson(),
//     ]
// );
// exit();

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
            $_GET,
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
        // $responses = $this->responseI->findAll([
        //     "where" => [
        //         $this->responseI->statements["ID"] => [$id, "equal"]
        //     ]
        // ]);

        $response = $this->responseI->findOne([
            "where" => [
                $this->responseI->statements["ID"] => [$id, "equal"]
            ]
        ]);

        return $response;
        // return $this->convertToJson($responses);
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
$host = "*";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: $host");
echo json_encode(
    [
        "response" => call_user_func(array($instance, $requestType)),
    ]
);
exit();
