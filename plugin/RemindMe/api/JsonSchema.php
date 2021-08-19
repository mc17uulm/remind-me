<?php

namespace RemindMe\api;

use Opis\JsonSchema\Schema;
use Opis\JsonSchema\Validator as SchemaValidator;
use WP_REST_Request as Request;
use JsonException;

/**
 * Class JsonSchema
 * @package RemindMe\api
 */
class JsonSchema
{

    /**
     * @var Schema
     */
    private Schema $schema;
    /**
     * @var string|null
     */
    private ?string $error;
    /**
     * @var array|null
     */
    protected ?array $result;

    /**
     * JsonSchema constructor.
     * @param string $filename
     * @param string $base
     * @throws ValidationException
     */
    public function __construct(string $filename = "", string $base = "") {
        if($base === "" && defined("REMIND_ME_SCHEMAS")) {
            $base = REMIND_ME_SCHEMAS;
        }

        $file = "$base$filename";
        if(!file_exists($file)) throw new ValidationException("File does not exist");
        if(!is_readable($file)) throw new ValidationException("Cannot read schema file");

        $content = file_get_contents($file);
        if($content === false) throw new ValidationException("Could not read schema file content");

        $this->schema = Schema::fromJsonString($content);
        $this->error = null;
        $this->result = null;
    }

    /**
     * @param Request $req
     * @param bool $throw_on_error
     * @return $this
     * @throws ValidationException
     */
    public function validate(Request $req, bool $throw_on_error = true) : self {
        $body = $req->get_body();
        try {
            $payload = json_decode($body, false, 512, JSON_THROW_ON_ERROR);

            $validator = new SchemaValidator();
            $result = $validator->schemaValidation($payload, $this->schema);

            if($result->isValid()) {
                $this->result = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
                return $this;
            }

            if($result->getFirstError() !== null) {
                $this->error = $result->getFirstError()->keyword() . ": " . implode(", ", $result->getFirstError()->keywordArgs());
            } else {
                $this->error = "no error given";
            }
            if($throw_on_error) throw new ValidationException($this->error);
            return $this;
        } catch (JsonException $e) {
            throw new ValidationException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function cast() { return null; }

    /**
     * @return bool
     */
    public function has_error() : bool {
        return $this->error !== null;
    }

    /**
     * @return string
     */
    public function get_error() : string {
        if($this->error === null) return "";
        return $this->error;
    }

    /**
     * @return array
     */
    public function get_result() : array {
        if($this->result === null) return [];
        return $this->result;
    }

}