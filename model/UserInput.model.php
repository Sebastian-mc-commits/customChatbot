<?php
namespace UserInput;

$pathName = realpath(__DIR__ . "/..");

require_once "$pathName/model/index.php";

use Model\IndexModel;

class Model extends IndexModel {

  public function __construct()
  {
    parent::__construct("userInput", [
      "ID" => "id",
      "INPUT_VALUE" => "inputValue",
      "RESPONSE_ID" => "responseId"
    ]);
  }
}