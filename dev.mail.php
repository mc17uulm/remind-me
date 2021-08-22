<?php

require_once ABSPATH . WPINC . '/class-smtp.php';

function send_dev_mail(\PHPMailer\PHPMailer\PHPMailer &$mailer) : void {
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