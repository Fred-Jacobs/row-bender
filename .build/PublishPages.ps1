$cwd = $PSScriptRoot
$ghPagesPath = [System.IO.Path]::Combine($cwd, 'gh-pages')
$ghPagesSpaPath = [System.IO.Path]::Combine($ghPagesPath, 'spa')
$ghPagesDocPath = [System.IO.Path]::Combine($ghPagesPath, 'docs')
$repoPath = Split-Path $cwd
$spaPath = [System.IO.Path]::Combine($repoPath, 'dist', 'spa')

if (Test-Path $ghPagesPath) {
  try {
    # Remove-Item $ghPagesPath -Recurse
    git -C $ghPagesPath reset --hard
    git -C $ghPagesPath pull --all
  }
  catch {
    throw "Exception updating pages folder!"
  }
}
else {
  try {
    $gitRemote = git remote
    $gitRemote = git remote get-url $gitRemote

    git clone --branch 'gh-pages' $gitRemote $ghPagesPath
  }
  catch {
    throw "Exception cloning pages folder!"
  }
}

if (Test-Path $ghPagesDocPath) {
  try {
    Remove-Item $ghPagesDocPath -Recurse
  }
  catch {
    throw "Exception updating pages folder!"
  }
}
if (Test-Path $ghPagesSpaPath) {
  try {
    Remove-Item $ghPagesSpaPath -Recurse
  }
  catch {
    throw "Exception updating pages folder!"
  }
}

try {
  Push-Location $repoPath
  quasar build
}
catch {
  throw "Exception building pages!"
}
finally {
  Pop-Location
}

try {
  Copy-item -Force -Recurse $spaPath -Destination $ghPagesPath
  Rename-Item $ghPagesSpaPath -NewName $ghPagesDocPath
}
catch {
  throw "Exception copying pages folder!"
}

try {
  git -C $ghPagesPath add .
  git -C $ghPagesPath commit -m "publish"
  git -C $ghPagesPath push
}
catch {
  throw "Exception pushing pages folder!"
}
