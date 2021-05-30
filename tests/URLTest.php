<?php

declare(strict_types=1);

define('WP_REMINDER_DIR', __DIR__ . '/../');

use PHPUnit\Framework\TestCase;
use WPReminder\api\Template;

final class URLTest extends TestCase
{

    /**
     * @test
     */
    public function testValidStringWithExistingQuery() {
        $base = "https://development.code-leaf.de/?page_id=13";
        $params = [
            "wp-reminder-action=activate",
            "wp-reminder-token=e73c4b4205a21067647959a0bfa2e644"
        ];
        $url = Template::parse_url($base, $params);

        $this->assertEquals(
            'https://development.code-leaf.de/?page_id=13&wp-reminder-action=activate&wp-reminder-token=e73c4b4205a21067647959a0bfa2e644',
            $url
        );
    }

    /**
     * @test
     */
    public function testValidStringWithoutExistingQuery() {
        $base = "https://development.code-leaf.de/subscriber_page";
        $params = [
            "wp-reminder-action=activate",
            "wp-reminder-token=e73c4b4205a21067647959a0bfa2e644"
        ];
        $url = Template::parse_url($base, $params);

        $this->assertEquals(
            'https://development.code-leaf.de/subscriber_page/?wp-reminder-action=activate&wp-reminder-token=e73c4b4205a21067647959a0bfa2e644',
            $url
        );
    }

}