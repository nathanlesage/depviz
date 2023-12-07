<?php

// Load environment file
if (!file_exists('.env')) {
  http_response_code(500);
  echo "Could not find executable.";
  exit(1);
}

$lines = file('.env');
if ($lines === false) {
  http_response_code(500);
  echo "Could not find executable.";
  exit(1);
}

foreach ($lines as $line) {
  $line = trim($line);
  // Ignore empty lines and comments
  if ($line == '' || str_starts_with($line, '#')) {
    continue;
  }

  [ $key, $value ] = explode('=', $line, 2);
  $key = trim($key);
  $value = trim($value);

  putenv("$key=$value");
  $_ENV[$key] = $value;
  $_SERVER[$key] = $value;
}

$sentence = $_GET['sentence'];

// Before we do anything, clean up the cache -> any file older than a day gets
// removed.
$files = scandir("../convert_cache",  SCANDIR_SORT_DESCENDING);

if ($files !== false) {
  // Remove files older than one day
  $yesterday = time() - 60 * 60 * 24;
  foreach ($files as $file) {
    $stat = stat("../convert_cache/$file");
    if ($stat !== false && $stat['mtime'] < $yesterday) {
      unlink("../convert_cache/$file");
    }
  }
}

// We're hashing the sentence using SHA1, which is fast and sufficient for our
// purposes to ensure that the same sentence produces the same files always.
// NOTE: This is still not entirely threadsafe.
$sha = sha1($sentence);
$infile = "../convert_cache/$sha.txt";
$outfile = "../convert_cache/$sha.json";

file_put_contents($infile, $sentence);

$exit_code = 0;
$_unused = null;
// Only create the file if it doesn't exist
if (!file_exists($outfile)) {
  $python = getenv("SPACY_VENV_PYTHON_EXEC");
  exec("$python ../parse.py $infile $outfile", $_unused, $exit_code);
}

// Always remove the infile
unlink($infile);

if ($exit_code !== 0) {
  http_response_code(500);
  echo "Could not retrieve dependency tree for sentence.\n";
  echo $result;
} else {
  http_response_code(200);
  header('Content-Type', 'application/json');
  echo file_get_contents($outfile);
}
