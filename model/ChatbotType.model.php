<?php

namespace ChatbotType;

$pathName = realpath(__DIR__ . "/..");

require_once "$pathName/model/index.php";

use Model\IndexModel;

class Model extends IndexModel
{

  public function __construct()
  {
    parent::__construct("chatbotType", [
      "ID" => "id",
      "TITLE" => "title",
      "DEFAULT_MESSAGE" => "defaultMessage"
    ]);
  }
}
