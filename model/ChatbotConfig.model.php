<?php

namespace ChatbotConfig;

$pathName = realpath(__DIR__ . "/..");

require_once "$pathName/model/index.php";
require_once "$pathName/model/Response.php";

use Response\Model as RModel;

use Model\IndexModel;

class Model extends IndexModel
{

  public function __construct()
  {
    parent::__construct("chatbotConfig", [
      "ID" => "id",
      "QUESTION" => "question",
      "TYPE_ID" => "typeId"
    ]);
  }

  public function getAnswerByQuestionAndTypeId($chatbotType, $question, $avoid = [])
  {
    $responseI = new RModel();
    $responseI_ID = $responseI->statements["QUESTION_ID"];
    $currentModel_typeId = $this->statements["TYPE_ID"];
    $currentModel_ID = $this->statements["ID"];
    $in = $this->in($avoid);
    $inAvoid = empty($in) ? "" : " AND r." . $responseI->statements["RESPONSE_CONTENT"] . " NOT IN $in";

    $query = "SELECT r." . $responseI->statements["ID"] . " AS responseId, r.*, ct.* "
      .
      "FROM $this->modelName ct INNER JOIN $responseI->modelName r "
      .
      "ON r.$responseI_ID = ct.$currentModel_ID "
      .
      "WHERE MATCH (ct." . $this->statements["QUESTION"] . ") "
      .
      "AGAINST('$question' IN NATURAL LANGUAGE MODE) > 0 "
      .
      "AND ct.$currentModel_typeId = $chatbotType" . $inAvoid;

    return $this->getConnection()->query($query);
  }
}
