{
  description = "the_grid dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.elixir
            pkgs.erlang
            pkgs.nodejs
            pkgs.git
            pkgs.inotify-tools
            pkgs.watchman
          ];
        };
      });
}
