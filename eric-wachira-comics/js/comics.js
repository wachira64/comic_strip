/**
 * comics.js — Eric Wachira Comic Library
 * ────────────────────────────────────────
 * To add a new comic:
 *   1. Create a folder with your comic's slug name  e.g.  eco-the-elephant/
 *   2. Add cover.jpg + panel-01.jpg … panel-XX.jpg inside that folder
 *   3. Copy one of the objects below, fill in the details, set status: 'available'
 *   4. Save and re-deploy — done.
 */

const COMICS = [

  {
    slug:     'two-bag-rule',          // folder name — must match exactly
    status:   'available',            // 'available' | 'coming-soon'
    title:    'The Two-Bag Rule',
    tag:      'Environment · Community',
    author:   'Eric Wachira',
    desc:     'In Mapambo Estate, Kevo\'s ruined football sparks a revolution. A mountain of trash, a wrestling match nobody asked for, and a community that fights back.',
    panels:   15,
    captions: [
      { title: "In Mapambo Estate, a mountain of trash loomed over the neighbourhood football pitch.", caption: "The kids had a name for it: THE STINKER." },
      { title: "The crisis peaked when Kevo's football landed in a puddle of black soup.", caption: "Rotting food trapped inside plastic bags. His best ball — ruined." },
      { title: "While Kevo mourned his ball, the neighbourhood's funniest man, Captain, came over.", caption: '"Oh Kevo! That is not a football anymore. That is a cabbage ball!"' },
      { title: "Captain explained the science behind the stench.", caption: "The smell was a wrestling match — things that rot vs. things that do not. Put them together and nobody wins." },
      { title: "Kevo and Captain stood by the mountain together, staring at the mess.", caption: "Two types of waste. They should never share the same bag." },
      { title: "Mzee Juma, the wise village elder, agreed and offered his own verdict.", caption: '"Food is a gift for the soil. Plastic is a stranger that does not belong in the same bed."' },
      { title: "Mzee Juma's shamba was living proof. Kevo had seen enough.", caption: "He introduced the Two-Bag Rule: OZA for things that rot, HAIOZI for things that do not." },
      { title: "Mama Njuguna, the sharp-eyed shopkeeper, began policing her customers.", caption: "No milk for anyone who mixes their trash. Her shop. Her rules." },
      { title: "Word spread fast. Nobody argued with that look.", caption: "Mama Njuguna's stern face became the face of the movement across Mapambo Estate." },
      { title: "Meanwhile, Vibe the boda boda rider had a revelation of his own.", caption: "Clean, segregated plastic was not waste at all. It was something entirely different." },
      { title: "Vibe held up his sorted plastic bottles and grinned behind his shades.", caption: '"Fuel money," he said. The recycling centre paid for every clean bag he brought in.' },
      { title: "Vibe loaded his boda boda and rode through Mapambo.", caption: "Sorted plastic in the sack. Money on his mind. The recycling centre was waiting." },
      { title: "Back at the shamba, Mzee Juma poured the OZA bag into the compost pit.", caption: "Yesterday's food scraps became tomorrow's rich manure. Nothing wasted. Everything used." },
      { title: "The Big Mountain began to shrink. The air cleared. The black soup dried up.", caption: "A garbage truck — a real one — finally came to Mapambo Estate." },
      { title: "The football pitch echoed with cheers once more.", caption: "When a community stops the wrestling match, everyone wins a cleaner, greener home." },
    ]
  },

  // ── ADD YOUR NEXT COMIC BELOW ──────────────────────────────────────────────
  // Duplicate this block, fill in the details, change status to 'available'
  {
    slug:     'eco-the-elephant',
    status:   'coming-soon',
    title:    'Meet Eco the Elephant',
    tag:      'Environment · Wildlife',
    author:   'Eric Wachira',
    desc:     'Another story from East Africa. Watch this space.',
    panels:   0,
    captions: []
  },

  {
    slug:     'coming-soon-3',
    status:   'coming-soon',
    title:    'New Title',
    tag:      'Coming Soon',
    author:   'Eric Wachira',
    desc:     'Another story from East Africa. Watch this space.',
    panels:   0,
    captions: []
  },

];
