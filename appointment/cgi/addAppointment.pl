#!C:\xampp\perl\bin\perl.exe

use strict;
use warnings;
use JSON qw( decode_json );
use DBI;

my $dbfile = "app.db";
my $buffer;
my $decoded;

my $dsn = "dbi:SQLite:dbname=$dbfile";
my $user = "";
my $password = "";
my $dbh = DBI->connect($dsn, $user, $password, {
                           PrintError => 0,
                           RaiseError => 1,
                           AutoCommit => 1,
                           FetchHashKeyName => 'NAME_lc',
    });


$ENV{'REQUEST_METHOD'} =~ tr/a-z/A-Z/;
if ($ENV{'REQUEST_METHOD'} eq "POST")
{
   	read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});
    $decoded = decode_json($buffer);
    my $appDate = $decoded->{appDate};
    my $appTime = $decoded->{appTime};
    my $appDesc = $decoded->{appDesc};

    $dbh->do('insert into appointment (appDate, appTime, appDesc) values (?, ?, ?)',
                undef, $appDate, $appTime, $appDesc);

	print "Content-type:application/json; charset=utf-8\n\n";
	print '{"success":1}';

}else {
	print "Content-type:application/json; charset=utf-8\n\n";
	print '{"success":0}';
}

$dbh->disconnect;
