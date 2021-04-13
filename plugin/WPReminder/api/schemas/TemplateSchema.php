<?php

namespace WPReminder\api\schemas;

use WPReminder\api\JsonSchema;
use WPReminder\api\ValidationException;

/**
 * Class TemplateSchema
 * @package WPReminder\api\schemas
 */
final class TemplateSchema extends JsonSchema
{

    /**
     * TemplateSchema constructor.
     * @throws ValidationException
     */
    public function __construct()
    {
        parent::__construct("template.schema.json");
    }

}