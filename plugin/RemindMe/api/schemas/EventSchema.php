<?php

namespace RemindMe\api\schemas;

use RemindMe\api\JsonSchema;
use RemindMe\api\ValidationException;

/**
 * Class EventSchema
 * @package RemindMe\api\schemas
 */
final class EventSchema extends JsonSchema
{

    /**
     * EventSchema constructor.
     * @throws ValidationException
     */
    public function __construct()
    {
        parent::__construct("event.schema.json");
    }

}