#!C:\xampp\perl\bin\perl.exe

use strict;
use warnings;
 
use DBI;
 
my $dbfile = "app.db";
 
my $dsn      = "dbi:SQLite:dbname=$dbfile";
my $user     = "";
my $password = "";
my $dbh = DBI->connect($dsn, $user, $password, {
   PrintError       => 0,
   RaiseError       => 1,
   AutoCommit       => 1,
   FetchHashKeyName => 'NAME_lc',
});
 

$dbh->do('DROP TABLE IF EXISTS appointment');

my $crt = <<'EOSQL';
CREATE TABLE IF NOT EXISTS appointment (
  id       INTEGER PRIMARY KEY,
  appDate    TEXT NOT NULL,
  appTime    TEXT NOT NULL,
  appDesc    TEXT
)
EOSQL

$dbh->do($crt);


my $appDate = '11/18/2017';
my $appTime = '10:30 AM';
my $appDesc = 'conference call';
# $dbh->do('INSERT INTO appointment (appDate, appTime, appDesc) VALUES (?, ?, ?)',
# undef, $appDate, $appTime, $appDesc);


print "Content-type: application/json; charset=utf-8\n\n";
print "database created."


