<?php

namespace RemindMe\api\schemas;

use RemindMe\api\JsonSchema;
use RemindMe\api\objects\settings\Templates;
use RemindMe\api\ValidationException;

/**
 * Class TemplatesSchema
 * @package RemindMe\api\schemas
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