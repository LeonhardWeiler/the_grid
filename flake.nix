{
  description = "The Grid - Go realtime canvas";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        goApp = pkgs.buildGoModule {
          pname = "the-grid";
          version = "0.1.0";

          src = ./.;

          vendorHash = "sha256-7JqwcenKhaOgziXfkl32qz2VrZ0zKhNJMLfvHto/Pco=";

          buildPhase = ''
            go build -o the-grid .
          '';

          installPhase = ''
            mkdir -p $out/bin
            cp the-grid $out/bin/
          '';
        };
      in {
        packages.default = goApp;

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            go
            gopls
            gotools
            air
            git
            bun
          ];

          shellHook = ''
            echo "🚀 The Grid dev environment ready"
            echo "Go version:"
            go version
            echo "Bun version:"
            bun --version
          '';
        };
      });
}
