<?php

require "config/database/init.php";

$requestType = $_GET["requestType"];
$data = array();
$connInstance = new InitDb();
$conn = $connInstance->getConnection();

$type = "";
$query = "";

function reducer($post)
{
    return [
        "chatBotType" => function () use ($post) {
            $chatBotType = $post["chatBotType"];
            $userQuestion = $post["userQuestion"];
            $getUserQuestion = getLike("cc.question", $userQuestion);

            return "SELECT * FROM chatbotconfig cc INNER JOIN chatbottype ct ON ct.id = cc.typeId WHERE cc.typeId = $chatBotType AND ($getUserQuestion)";
        },

        "chatBotTypeAvoid" => function ($notResponse) {
            $query = "";

            foreach ($notResponse as $element) {
                $query .= " AND cc.response NOT LIKE '%$element%'";
            }

            return $query;
        },
    ];
}

function getJson()
{
    $inputJSON = file_get_contents('php://input');

    return    json_decode($inputJSON, true);
}

function getLike($row, $likeSentence)
{

    return "$row LIKE '%$likeSentence%' OR $row LIKE '$likeSentence%'
    OR $row LIKE '%$likeSentence' OR $row = '$likeSentence'";
}

function removeLastWord($inputString)
{
    $wordsArray = explode(" ", $inputString);
    array_pop($wordsArray);

    return implode(" ", $wordsArray);
}

switch ($requestType) {

    case "getChatBotTypes":
        $type = "response";
        $query = "SELECT * FROM chatbottype";
        break;

    case "getChatBotAnswer":
        $type = "response";
        $post = getJson();
        
        foreach ($post as $key => $value) {
            
            if (!array_key_exists($key, reducer($post))) {
                continue;
            }
            
            $callback = reducer($post)[$key];
            
            $query .= $callback($value);
        }
        
        $query = $query . " LIMIT 1";
        
        break;
        
        case "getChatBotAnswerById":
            $id = $_GET["id"];
            $type = "response";
            $query = "SELECT * FROM chatbotconfig WHERE typeId = $id";
            break;

    default:
        http_response_code(400);
        exit();
}

if ($type == "response") {
    $exec = $conn->query($query);
    http_response_code(200);
    while ($row = $exec->fetch_assoc()) {
        $data[] = $row;
    }
}

$host = "*";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: $host");
echo json_encode(
    [
        "response" => $data,
        "h" => "Hello",
        "query" => $query,
        "post" => getJson(),
    ]
);
exit();
