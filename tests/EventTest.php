<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use WPReminder\api\objects\Event;

final class EventTest extends TestCase
{

    public function testCorrectMonthCalc() : void {
        $repeat = new Event("", 0,0,0,0);

        $this->assertEquals(
            5,
            $repeat->get_month_diff(0, 5)
        );

        $this->assertEquals(
            0,
            $repeat->get_month_diff(5, 5)
        );

        $this->assertEquals(
            10,
            $repeat->get_month_diff(5, 3)
        );
    }

    public function testIsCorrectMonth() : void {
        $start_three_months_ago = strtotime('-3 months');
        $end_in_one_year = strtotime('+1 year');
        $day = intval(date('j'));
        $repeat = new Event("", 3, $day, $start_three_months_ago, $end_in_one_year);

        $this->assertEquals(
            true,
            $repeat->execute_now()
        );
    }

    public function testIsNotCorrectMonth() : void {
        $start_three_months_ago = strtotime('-3 months');
        $end_in_one_year = strtotime('+1 year');
        $repeat = new Event("", 2, 15, $start_three_months_ago, $end_in_one_year);

        $this->assertEquals(
            false,
            $repeat->execute_now()
        );
    }

    public function testRepeatNotStarted() : void {
        $start = strtotime('+1 month');
        $end = strtotime('+1 year');
        $repeat = new Event("", 2, 1, $start, $end);
        $this->assertEquals(
            false,
            $repeat->execute_now()
        );
    }

    public function testRepeatAlreadyEnded() : void {
        $start = strtotime('-1 year');
        $end = strtotime('-1 day');
        $repeat = new Event("", 2, 1, $start, $end);
        $this->assertEquals(
            false,
            $repeat->execute_now()
        );
    }

}