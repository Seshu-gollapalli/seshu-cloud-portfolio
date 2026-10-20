# Seshu Kumar Gollapalli — Portfolio V23

## What's changed in V23
- Option C hero: the existing, user-approved portrait remains unchanged and is framed by a more visible layered cinematic 3D-inspired environment.
- More visible orbit rings, perspective floor grid, atmospheric glow, glass cloud/IaC/reliability labels, and depth framing.
- Pointer-driven parallax moves the environment separately from the portrait for a stronger depth effect.
- Responsive and reduced-motion styles retained.

## Run locally
1. Extract the ZIP.
2. Open `seshu-portfolio-v6/index.html` in Chrome or Edge.
3. Move the mouse over the hero image to see the layered parallax effect.

This is a CSS/HTML 3D-inspired stage, not a photorealistic animated 3D human model. The supplied portrait image is not AI-generated or face-edited.


## V24 Hybrid Cinematic Cloud Lab
This version combines the existing approved portrait with a CSS 3D-inspired hybrid cloud-lab scene: cloud hub, AWS/Azure/GCP nodes, data streams, perspective grid, orbital rings, and pointer-responsive depth. The portrait image file is preserved unchanged. Open `index.html` in a modern browser.


## V25 — Cinematic 3D hero + clean portfolio
Adds a WebGL layer behind the approved portrait: 3D orbital rings, cloud-core motif, network links and particles. The lower portfolio remains readable and recruiter-focused. Three.js loads from a CDN, so the 3D layer needs internet access. If WebGL/CDN is unavailable, the existing CSS hero remains. The portrait asset is unchanged. A local web server is recommended for testing.


## V26 — Full-screen hero
Navigation overlays the cinematic hero with a dark translucent gradient. Hero content has reserved top space so it should no longer sit underneath the fixed header. Mobile layouts switch to a taller content-first hero. This version keeps the existing portrait file unchanged.


## V27 — Hero layout fix
Adjusted the full-screen hero into a stable two-column desktop layout so the portrait stays visible beside the headline and the statistics no longer overlap the main composition. Mobile uses a stacked layout. The original portrait file is unchanged.


## V28 — Text chat + D-ID talking avatar
This version adds the supplied D-ID agent embed script and positions the existing portfolio text-chat launcher on the lower-left so it does not compete with the D-ID widget on the lower-right.
Before publishing, configure Allowed Domains in D-ID Manage Embed for the final HTTPS domain. For local testing, the widget may not load until D-ID's domain rules accept the origin. The embed uses the D-ID client key provided by the owner; treat it as a browser-facing client identifier and restrict it to the intended domain in D-ID.


## V29 Reel-inspired cinematic edition
This edition follows the supplied reel’s dark plum/black editorial look, magenta accent, large typography, cinematic portrait framing, and restrained motion. It intentionally removes the D-ID talking-avatar widget and floating assistant to match option A. The original approved portrait asset is retained unchanged. Run locally from this folder with `python -m http.server 8000`, then open `http://localhost:8000/`.


Version 34: filmed-laptop cinematic intro with a perspective screen, keyboard base, subtle glass reflections, and 3.9 years of experience. The intro auto-transitions to the portfolio after approximately 5.6 seconds; use ENTER PORTFOLIO to skip.


## V35 — Cinematic camera push and parallax
- Extended the laptop reveal to allow a more gradual, multi-stage camera move.
- Added subtle pointer-responsive ambient parallax and light movement.
- The Enter Portfolio control now performs a camera push-through transition before revealing the actual portfolio.
- Preserves the approved portrait asset and the 3.9 years experience figure.
- This is a browser-based CSS animation, not pre-rendered footage.
