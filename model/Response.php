<?php

namespace Response;

$pathName = realpath(__DIR__ . "/..");
require_once "$pathName/model/index.php";
require_once "$pathName/model/ChatbotType.model.php";
require_once "$pathName/model/ChatbotConfig.model.php";

use ChatbotConfig\Model as ChatbotC;
use ChatbotType\Model as ChatbotT;

use Model\IndexModel;

class Model extends IndexModel
{

  public function __construct()
  {
    parent::__construct("response", [
      "ID" => "id",
      "RESPONSE_CONTENT" => "responseContent",
      "IS_TREE" => "isTree",
      "TREE_ID" => "treeId",
      "QUESTION_ID" => "questionId",
      "IS_HTML" => "isHtml",
      "IS_MAIN_TREE" => "isMainTree",
      "REQUIRES_USER_INPUT" => "requiresUserInput",
      "RESPONSE_TITLE_ID" => "responseTitleId",
    ]);
  }

  public function getResponsesByMainTree($mainTreeId)
  {
    [$treeId, $isTree] = [
      $this->statements["TREE_ID"],
      $this->statements["IS_TREE"]
    ];

    $query = "SELECT * FROM $this->modelName WHERE $treeId = $mainTreeId AND $isTree = 1";
    return $this->getConnection()->query($query);
  }

  public function getResponsesByTypeId($typeId)
  {

    $chatbotConfigI = new ChatbotC();
    $chatbotTypeI = new ChatbotT();
    [$r, $chc, $cht] = ["r", "chc", "cht"];
    [$chcId, $chtId, $rQId, $chcTypeId, $rId] = [
      $chatbotConfigI->statements["ID"],
      $chatbotTypeI->statements["ID"],
      $this->statements["QUESTION_ID"],
      $chatbotConfigI->statements["TYPE_ID"],
      $this->statements["ID"]
    ];

    $query = "SELECT $r.$rId as responseId, $r.*, $chc.$chcId as chatbotConfigId, $chc.*, "
      .
      "$cht.$chtId as chatbotTypeId, $cht.* FROM $this->modelName $r "
      .
      "INNER JOIN $chatbotConfigI->modelName $chc ON $r.$rQId = $chc.$chcId "
      .
      "INNER JOIN $chatbotTypeI->modelName $cht ON $cht.$chtId = $chc.$chcTypeId "
      .
      "WHERE $cht.$chtId = $typeId";

    return $this->getConnection()->query($query);
  }
}
