<?php

namespace WPReminder\api\schemas;

use WPReminder\api\JsonSchema;
use WPReminder\api\objects\settings\Templates;
use WPReminder\api\ValidationException;

/**
 * Class TemplatesSchema
 * @package WPReminder\api\schemas
 */
final class TemplatesSchema extends JsonSchema
{

    /**
     * TemplatesSchema constructor.
     * @throws ValidationException
     */
    public function __construct()
    {
        parent::__construct("templates.schema.json");
    }

    /**
     * @return Templates
     */
    public function cast() : Templates
    {
        return new Templates($this->result);
    }

}