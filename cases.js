// Fireflies — case archive data
// Status values: "unresolved" | "found" | "mystery"
// All details sourced from public law enforcement / NCMEC / news records.
// This is a curated starting set, not an exhaustive database.

const CASES = [
  {
    id: "summer-wells",
    name: "Summer Moon Wells",
    status: "unresolved",
    age: 5,
    date: "June 15, 2021",
    location: "Beech Creek, Hawkins County, Tennessee",
    summary: "Summer went inside her family's home to play with her toys on a June evening and was never seen again. Her family believes she may have been taken from the basement, which had a door facing the back of the property.",
    detail: "An extensive search of more than 1,000 acres involving agencies from four states turned up no trace of her. The Tennessee Bureau of Investigation, FBI, and Hawkins County Sheriff's Office have pursued thousands of tips over the years, including a 2025 lead in Greeneville, but no arrests have been made. An AMBER Alert issued the day of her disappearance remains active. The TBI continues to release age-progression images; as of early 2026, the case is described by investigators as one of the most extensive missing-child investigations in state history.",
    source: "Tennessee Bureau of Investigation / NCMEC",
    tags: ["AMBER Alert", "Active Investigation"],
    image: "https://www.missingkids.org/bin/ncmec/poster/image?org=NCMC&caseId=1423522&type=participant&md5=c2e75b4701b333a42b7161c55e7af753",
    posterUrl: "https://www.missingkids.org/poster/NCMC/1423522/1"
  },
  {
    id: "dulce-alavez",
    name: "Dulce Maria Alavez",
    status: "unresolved",
    age: 5,
    date: "September 16, 2019",
    location: "Bridgeton, New Jersey",
    summary: "Dulce was playing with her younger brother at a park near her home when she vanished. Witnesses reported seeing a man lead a girl matching her description toward a maroon van.",
    detail: "Her brother was found alone shortly after, leading investigators to issue an AMBER Alert. Despite a description of a possible vehicle and suspect, the case remains unsolved more than six years later. The FBI has periodically renewed public appeals and reward offers. Dulce's mother has continued public advocacy for the case to stay active.",
    source: "Cumberland County Prosecutor's Office / NCMEC",
    tags: ["AMBER Alert", "Witnessed Abduction"],
    image: "https://www.missingkids.org/bin/ncmec/poster/image?org=NCMC&caseId=1369063&type=participant&md5=36ebf81319b92e25fb807e646c1f5d23",
    posterUrl: "https://www.missingkids.org/poster/NCMC/1369063/1"
  },
  {
    id: "lina-sardar-khil",
    name: "Lina Sardar Khil",
    status: "unresolved",
    age: 3,
    date: "December 20, 2021",
    location: "San Antonio, Texas",
    summary: "Lina disappeared from a playground at her apartment complex while playing with other children, just out of her mother's direct line of sight for a few minutes.",
    detail: "Her family had recently arrived in the United States as Afghan refugees. Despite an AMBER Alert, FBI involvement, and a substantial reward, no confirmed sighting of Lina has surfaced. The FBI continues to investigate the case as an active abduction.",
    source: "San Antonio Police Department / FBI",
    tags: ["AMBER Alert", "Active Investigation"]
  },
  {
    id: "carlina-white",
    name: "Carlina Renae White",
    status: "found",
    age: 0,
    date: "August 4, 1987 (found January 2011)",
    location: "Harlem Hospital Center, New York City",
    summary: "At 19 days old, Carlina was taken from a Harlem hospital by a woman disguised as a nurse while being treated for a fever. She grew up under a different name, unaware of her origin.",
    detail: "In 2005, suspicious that her birth certificate didn't exist, Carlina began searching missing-children databases herself. She found her own infant photo on NCMEC's site and a DNA test confirmed her identity in January 2011 — 23 years after she vanished. It remains the longest-running infant abduction case ever solved by NCMEC, and the only one in which the victim led her own search. Her abductor, Ann Pettway, pleaded guilty to kidnapping and served roughly ten years in federal prison.",
    source: "NCMEC / FBI",
    tags: ["Reunited", "Self-Solved"]
  },
  {
    id: "relisha-rudd",
    name: "Relisha Tenau Rudd",
    status: "mystery",
    age: 8,
    date: "March 1, 2014",
    location: "Washington, D.C.",
    summary: "Relisha was last reliably seen in early March 2014 in the company of a janitor at the homeless shelter where her family was staying. Her disappearance wasn't reported for nearly three weeks.",
    detail: "The man she was last seen with was later found dead in an apparent murder-suicide, with a woman who was not Relisha found at the scene. No trace of Relisha herself has ever been found, and investigators have never been able to determine what happened to her after the days surrounding her last sighting. The case remains one of the more haunting unresolved disappearances in NCMEC's active files, in part because so little is confirmed about her final days.",
    source: "Metropolitan Police Department, D.C. / NCMEC",
    tags: ["AMBER Alert", "Unexplained"],
    image: "https://www.missingkids.org/bin/ncmec/poster/image?org=NCMC&caseId=1229904&type=participant&md5=f9df7427dabe209976a8b1d339206a6f",
    posterUrl: "https://www.missingkids.org/poster/NCMC/1229904/1"
  },
  {
    id: "sofia-juarez",
    name: "Sofia Lucerno Juarez",
    status: "mystery",
    age: 4,
    date: "February 4, 2003",
    location: "Kennewick, Washington",
    summary: "Sofia was last seen playing in her bedroom at home. Around 8 p.m., she walked out of the room and was never seen again, inside her own house, with family nearby.",
    detail: "There was no witnessed abduction and no sign of forced entry, which has made the case especially difficult to advance. Over twenty years of tips, searches, and renewed appeals — including age-progression images and a standing reward — have not produced a confirmed answer. Her case remains formally open with the Kennewick Police Department and NCMEC.",
    source: "Kennewick Police Department / NCMEC",
    tags: ["Cold Case", "Unexplained"],
    image: "https://www.missingkids.org/bin/ncmec/poster/image?org=NCMC&caseId=954908&type=participant&md5=9f3d2ed933f63e7935efd9b0d59bfa63",
    posterUrl: "https://www.missingkids.org/poster/NCMC/954908/1"
  },
  {
    id: "elizabeth-smart",
    name: "Elizabeth Ann Smart",
    status: "found",
    age: 14,
    date: "June 5, 2002 (found March 12, 2003)",
    location: "Salt Lake City, Utah",
    summary: "Elizabeth was abducted at knifepoint from her bedroom in the middle of the night. She was held captive for nine months, often in plain sight, before being recognized by a passerby in a Salt Lake City suburb.",
    detail: "Her case prompted significant national changes in how AMBER Alerts and missing-child cases are handled, partly because investigators initially focused on family members before pursuing other leads. Elizabeth has since become a prominent advocate for survivors of abduction and assault, and testified in the federal trial of her abductor, who was sentenced to life in prison.",
    source: "Salt Lake City Police Department / FBI",
    tags: ["Reunited", "Advocacy"]
  },
  {
    id: "jaycee-dugard",
    name: "Jaycee Lee Dugard",
    status: "found",
    age: 11,
    date: "June 10, 1991 (found August 26, 2009)",
    location: "South Lake Tahoe, California",
    summary: "Jaycee was abducted while walking to her school bus stop, taken in front of her stepfather, who tried but failed to stop the vehicle.",
    detail: "She was held for over 18 years, just a short distance from her childhood home, and had two children during her captivity. She was found after her captor brought her, using a different name, to a parole office, where investigators grew suspicious of the situation. Her case led to reforms in how parolees are supervised. Jaycee has since written about her experience and founded a foundation supporting survivors of abduction.",
    source: "El Dorado County Sheriff's Office / FBI",
    tags: ["Reunited", "Advocacy"]
  },
  {
    id: "trenton-duckett",
    name: "Trenton J Duckett",
    status: "unresolved",
    age: 2,
    date: "August 27, 2006",
    location: "Leesburg, Florida",
    summary: "Trenton's mother reported him missing from their apartment, saying she put him to bed and discovered him gone the next morning, with a window screen removed.",
    detail: "Investigators found inconsistencies in the mother's account, and she was never charged but remained a person of interest before her death in 2008. No trace of Trenton has been found in the years since. The case remains formally unsolved and is among the longer-running entries on NCMEC's active AMBER Alert list.",
    source: "Lake County Sheriff's Office, Florida / NCMEC",
    tags: ["AMBER Alert", "Cold Case"],
    image: "https://www.missingkids.org/bin/ncmec/poster/image?org=NCMC&caseId=1052224&type=participant&md5=873b341019e00af30121434aaea2d0c3",
    posterUrl: "https://www.missingkids.org/poster/NCMC/1052224/1"
  },
  {
    id: "kyron-horman",
    name: "Kyron Richard Horman",
    status: "mystery",
    age: 7,
    date: "June 4, 2010",
    location: "Portland, Oregon",
    summary: "Kyron was last confirmed seen by his stepmother at his elementary school science fair, walking toward his classroom. He never appeared in attendance that morning.",
    detail: "Because the disappearance occurred inside a school building rather than in public, investigators have never been able to reconstruct what happened after he was last seen. No AMBER Alert criteria were initially met since there was no witnessed abduction. Civil litigation and shifting public scrutiny around family members have continued for over a decade without a resolution to the central question of what happened to Kyron.",
    source: "Multnomah County Sheriff's Office",
    tags: ["Cold Case", "Unexplained"]
  }
];
