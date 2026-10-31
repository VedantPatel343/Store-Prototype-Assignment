# Catalog imagery

## Store refresh

THREAD & FORM now contains all eight apparel items. STILL HOME contains Mori Dome Table Lamp, Sunday Stoneware Mug, Terra Arch Vase and Tempo Oak Wall Clock. Internal store IDs remain `apex` and `northline` for persistence compatibility; new home products have new IDs so saved clothing never silently becomes a home product.

Six new JPEG assets were generated with the built-in imagegen tool and bundled locally. Home product prompts used: "Single square photorealistic ecommerce product photograph of [subject]. Whole object centered with generous margin on warm light gray background. Soft studio lighting, realistic materials, subtle shadow. No people, no logos, no watermark, no extra objects."

- dome-lamp.jpg subject: a single forest-green metal dome table lamp with a slim stem and round base
- stoneware-mug.jpg subject: a single cream speckled ceramic mug with a rounded handle
- arch-vase.jpg subject: a single terracotta ceramic vase with a sculptural rounded arch-shaped body and small opening
- oak-clock.jpg subject: a single round oak wall clock with a cream face, simple black hour markers and two black hands, no lettering
- still-hero.jpg prompt: wide editorial interior photograph of a warm minimalist living room with an oak sideboard, green dome lamp, terracotta vase and cream ceramics. Generous darker negative space on lower left for white overlay text. No text.
- thread-hero.jpg prompt: wide editorial fashion photograph of neatly arranged charcoal hoodie, black t-shirt, forest green shorts and oatmeal knitwear on a dark studio bench. Sophisticated apparel campaign. Generous dark negative space on lower left for white overlay text. No text.

Image dimensions are explicitly set to 100% of the frame in both axes; this overrides bundled bitmap intrinsic dimensions on native platforms. Product photos use contain; promotional banners use cover.

The eight product JPGs are AI-generated product illustrations made with the built-in imagegen tool. They depict the fictional Apex Athletics and Northline catalog, not verified commercial products. Prices and availability remain demo data. The existing apex-hero.jpg and northline-hero.jpg photographs are unchanged.

## Generation prompts

Each asset used this prompt, substituting the subject below:

Create a single square photorealistic ecommerce catalog photograph of [subject]. Isolated on warm light gray studio background, soft natural shadow, realistic fabric texture and seams, premium clean product photography. Entire product centered within middle 70% of frame so it survives thumbnail cropping. No people, no text, no branding, no logos, no watermark. This is an individual product asset for a mobile shop.

- stride-runner.jpg: a pair of charcoal black mesh running shoes, sculpted off-white cushioned soles, three-quarter side view
- flex-hoodie.jpg: a charcoal pullover hoodie, drawstring hood, kangaroo pocket, ribbed cuffs, front flat lay
- court-short.jpg: a pair of forest green athletic shorts, elastic drawstring waist, side pockets, front flat lay
- training-tee.jpg: a plain black short sleeve crew neck training t-shirt, front flat lay
- ridge-parka.jpg: a dark teal thigh-length hooded insulated parka, front zipper, two flap pockets, front view
- base-crew.jpg: an oatmeal beige long sleeve crew neck knit sweater with ribbed collar cuffs and hem, front flat lay
- trail-beanie.jpg: one rust red rib-knit beanie with folded cuff
- wool-sock.jpg: a pair of oatmeal wool-knit crew socks, ribbed cuffs, subtly darker heels and toes

Generated PNGs were encoded as JPEGs for the bundled mobile assets. Product frames use contain to preserve the full product; lifestyle hero frames use cover.
