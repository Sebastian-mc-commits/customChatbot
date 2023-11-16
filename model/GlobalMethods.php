<?php

namespace TraitMethods;

trait GlobalMethods
{
    function _filterExpectedValues($params, ...$expectedValues)
    {

        $newArray = [];

        foreach ($expectedValues as $expectedValue) {
            $newArray[$expectedValue] = isset($params[$expectedValue]) ? $params[$expectedValue] : null;
        }
        return $newArray;
    }

    function _getExpectedValues(&$array, $length)
    {

        for ($i = 0; $i < $length; $i++) {
            if (!isset($array[$i])) {
                $array[$i] = null;
            }
        }

        return $array;
    }

    function _isNestedKeyExists($array, $key)
    {
        return isset($array[$key]) ? $array[$key] : null;
    }

    function toUpperCase($str = "")
    {
        $underscore = "_";
        $string = preg_replace("/([A-Z])/", "$underscore$1", $str);
        return strtoupper($string);
    }
}
