<?php

namespace RemindMe\api\schemas;

use RemindMe\api\JsonSchema;
use RemindMe\api\ValidationException;

/**
 * Class SubscriberSchema
 * @package RemindMe\api\schemas
 */
final class SubscriberSchema extends JsonSchema
{

    /**
     * SubscriberSchema constructor.
     * @throws ValidationException
     */
    public function __construct()
    {
        parent::__construct("subscriber.schema.json");
    }

}