# Legacy design concepts

Status: **Legacy**. Do not use anything in this directory.

The HTML concepts and prototypes here (homepage, what-we-do, Youth Tech
Academy, hero capsule slideshow) describe abandoned earlier states of the
redesign. The repository owner has ruled that every design file already in
the repository is legacy and that the written redesign brief is the only
design authority.

Do not open these for direction, do not port their markup, and do not treat a
past commit's approved concept as still approved.

The `.eval.mjs` and `verify-*.mjs` files here check implementations against
those legacy concepts. They are not part of the gate suite (`npm test` globs
`**/*.test.ts` only) and their assertions no longer describe the target
design. `npm run eval:capsule` still runs one of them; treat a failure as
information about drift from the old concept, not as a defect.

Working code remains authoritative for what is implemented. Only the design
artefacts are dead.
