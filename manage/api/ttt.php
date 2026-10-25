<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');
$domain = 'sch1298.local';
$username = 'guest';
$password = '12981298';
$ldapconfig['host'] = '192.168.20.50';
$ldapconfig['port'] = 389;
$ldapconfig['basedn'] = 'dc=sch1298,dc=local';

$ds=ldap_connect($ldapconfig['host'], $ldapconfig['port']);
ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);

$dn="ou=Technology,".$ldapconfig['basedn'];
$bind=ldap_bind($ds, $username .'@' .$domain, $password);
$isITuser = ldap_search($bind,$dn,'(&(objectClass=User)(sAMAccountName=' . $username. '))');
if ($isITuser) {
    echo("Login correct");
} else {
    echo("Login incorrect");
}
?>