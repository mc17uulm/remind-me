<?php

require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

function send_dev_mail(PHPMailer &$mailer) : void {
    $mailer->SMTPDebug = 0;
    $mailer->isSMTP();
    $mailer->SMTPAuth = true;
    $mailer->Username = "test@code-leaf.de";
    $mailer->Password = "deploy123";
    $mailer->Port = 25;
    $mailer->Host = 'code-leaf.de';
    $mailer->FromName = get_bloginfo('name');
    $mailer->From = 'test@code-leaf.de';
}