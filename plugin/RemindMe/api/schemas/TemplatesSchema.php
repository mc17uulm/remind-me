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
     * @throws ValidationException
     */
    public function cast() : Templates
    {
        if($this->result === null) throw new ValidationException('JsonSchema returned null result');
        return new Templates($this->result);
    }

}