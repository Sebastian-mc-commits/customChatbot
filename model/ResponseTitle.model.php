<?php

namespace ResponseTitle;

$pathName = realpath(__DIR__ . "/..");
require_once "$pathName/model/index.php";

use Model\IndexModel;

class Model extends IndexModel
{

  public function __construct()
  {
    parent::__construct("responseTitle", [
      "ID" => "id",
      "TITLE" => "title",
      "END_TITLE" => "endTitle"
    ]);
  }
}
