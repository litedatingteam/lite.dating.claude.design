/* lite.dating — mock data (global window.DB) */
(function () {
  const CATEGORIES = {
    movement:  { label: 'Movement',     hue: 155 },
    food:      { label: 'Food & Drink', hue: 30  },
    culture:   { label: 'Culture',      hue: 300 },
    nightlife: { label: 'Nightlife',    hue: 280 },
    travel:    { label: 'Travel',       hue: 220 },
    creative:  { label: 'Creative',     hue: 0   },
    lifestyle: { label: 'Lifestyle',    hue: 120 },
    ideas:     { label: 'Ideas',        hue: 250 },
  };

  const INTERESTS = {
    movement:  ['Running', 'Climbing', 'Yoga', 'Cycling', 'Swimming', 'Hiking', 'Pilates', 'Football'],
    food:      ['Coffee', 'Wine', 'Cooking', 'Street food', 'Baking', 'Vegetarian', 'Natural wine', 'Brunch'],
    culture:   ['Cinema', 'Museums', 'Theatre', 'Poetry', 'History', 'Architecture', 'Jazz', 'Bookshops'],
    nightlife: ['Live music', 'Dancing', 'Vinyl bars', 'Techno', 'Cocktails', 'Open mic'],
    travel:    ['Road trips', 'Slow travel', 'Trains', 'Islands', 'Languages', 'Camping'],
    creative:  ['Photography', 'Ceramics', 'Writing', 'Painting', 'Film photo', 'Design', 'Music making'],
    lifestyle: ['Plants', 'Dogs', 'Cats', 'Thrifting', 'Minimalism', 'Early mornings', 'Tea'],
    ideas:     ['Philosophy', 'Startups', 'Climate', 'Psychology', 'Astronomy', 'Chess', 'Urbanism'],
  };

  // helper to attach category to an interest label
  const cat = {};
  Object.entries(INTERESTS).forEach(([c, list]) => list.forEach((i) => (cat[i] = c)));
  const tag = (name) => ({ name, cat: cat[name] || 'ideas' });

  const P = (o) => Object.assign({
    verified: true, fav: false, online: false,
    channels: { instagram: { verified: true }, telegram: { verified: false } },
  }, o);

  const PROFILES = [
    P({ id: 'mira',  name: 'Mira',  age: 27, city: 'Kadıköy, İstanbul', dist: 3,  photos: 5, gender: 'Woman',
      bio: 'Architect who collects coffee shops and old cinema tickets.',
      about: 'I draw buildings by day and chase the best filter coffee by night. Looking for someone who can argue about films and still split a late dessert. I keep things light here — if we click, the real talk happens on Instagram.',
      online: true,
      interests: ['Architecture', 'Coffee', 'Cinema', 'Film photo', 'Slow travel', 'Natural wine'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
    P({ id: 'devran', name: 'Devran', age: 31, city: 'Beşiktaş, İstanbul', dist: 6, gender: 'Man',
      bio: 'Trail runner, terrible cook, decent listener.',
      about: 'Weekends are for the forest and bad attempts at sourdough. I work in product and I am trying to do fewer things, better. No games here — I would just like to meet someone kind.',
      interests: ['Running', 'Hiking', 'Cooking', 'Startups', 'Dogs', 'Jazz'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
    P({ id: 'lena',  name: 'Lena',  age: 29, city: 'Cihangir, İstanbul', dist: 4, gender: 'Woman',
      bio: 'Ceramicist. I make mugs you would actually keep.',
      about: 'Studio most days, sea swims when it is warm enough to lie about. I love a long walk with no destination. Tell me the last thing that genuinely made you laugh.',
      online: true,
      interests: ['Ceramics', 'Swimming', 'Poetry', 'Plants', 'Thrifting', 'Tea'],
      channels: { instagram: { verified: true }, telegram: { verified: false } } }),
    P({ id: 'arda',  name: 'Arda',  age: 33, city: 'Karşıyaka, İzmir', dist: 41, gender: 'Man',
      bio: 'Jazz on vinyl, espresso standing up, sea every morning.',
      about: 'İzmir keeps me honest. I run a small record bar and I am happiest when the room is full and the bass is warm. Looking for someone who does not mind a late night.',
      interests: ['Vinyl bars', 'Live music', 'Coffee', 'Swimming', 'Cocktails', 'Cinema'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
    P({ id: 'noor',  name: 'Noor',  age: 26, city: 'Çankaya, Ankara', dist: 38, gender: 'Woman',
      bio: 'PhD by day, climbing gym by night.',
      about: 'I study cities and how people move through them. Strong opinions on trains. I climb to switch my brain off. Would love to find someone curious and a little stubborn.',
      interests: ['Climbing', 'Urbanism', 'Trains', 'Bookshops', 'Coffee', 'Chess'],
      channels: { instagram: { verified: false }, telegram: { verified: true } } }),
    P({ id: 'sena',  name: 'Sena',  age: 28, city: 'Moda, İstanbul', dist: 3, gender: 'Woman',
      bio: 'Film photographer. Always one roll behind.',
      about: 'I shoot on 35mm and develop in my kitchen. I love brunch that turns into dinner. Looking for a partner in slow Sundays and spontaneous train tickets.',
      interests: ['Film photo', 'Brunch', 'Slow travel', 'Cats', 'Natural wine', 'Museums'],
      channels: { instagram: { verified: true }, telegram: { verified: false } } }),
    P({ id: 'emir',  name: 'Emir',  age: 30, city: 'Şişli, İstanbul', dist: 8, gender: 'Man',
      bio: 'Climate engineer. Plant dad of eleven.',
      about: 'I work on making buildings waste less. At home that means too many plants and a very patient cat. I like quiet mornings and loud kitchens.',
      interests: ['Climate', 'Plants', 'Cooking', 'Cycling', 'Cats', 'Early mornings'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
    P({ id: 'yuki',  name: 'Yuki',  age: 32, city: 'Kreuzberg, Berlin', dist: 1740, gender: 'Non-binary',
      bio: 'Sound designer, here when I visit İstanbul often.',
      about: 'I split time between Berlin clubs and İstanbul rooftops. Music is the whole personality, sorry. If you have a favourite venue, that is our first conversation.',
      interests: ['Techno', 'Music making', 'Dancing', 'Road trips', 'Cocktails', 'Design'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
  ];

  // current user
  const ME = {
    id: 'me', name: 'You', age: 29, city: 'Kadıköy, İstanbul',
    bio: 'Designer who likes long walks and short emails.',
    photos: 4,
    interests: ['Coffee', 'Cinema', 'Cycling', 'Architecture', 'Natural wine', 'Bookshops'],
    channels: {
      instagram: { verified: true, handle: '@you.designs' },
      telegram:  { verified: false, handle: null },
    },
    photoVerified: true,
  };

  const byId = (id) => PROFILES.find((p) => p.id === id);

  // incoming requests (inbox)
  const INBOX = [
    { id: 'r1', from: 'arda',  channel: 'instagram', note: 'Your record bar pick last week was perfect. Would love to talk music.', when: '2h', },
    { id: 'r2', from: 'sena',  channel: 'instagram', note: '', when: '1d' },
    { id: 'r3', from: 'noor',  channel: 'telegram',  note: 'Fellow train enthusiast. Trade handles?', when: '3d' },
  ];

  // sent requests
  const SENT = [
    { id: 's1', to: 'mira',   channel: 'instagram', note: 'Coffee + cinema, we would get along.', status: 'pending', when: '5h' },
    { id: 's2', to: 'devran', channel: 'instagram', note: '', status: 'declined', when: '2d' },
    { id: 's3', to: 'lena',   channel: 'instagram', note: 'Your mugs are beautiful.', status: 'accepted', when: '4d' },
  ];

  // connections (mutual)
  const CONNECTIONS = [
    { id: 'c1', who: 'lena', channel: 'instagram', handle: '@lena.makes', daysLeft: 11 },
    { id: 'c2', who: 'emir', channel: 'telegram',  handle: '@emir_t',     daysLeft: 3  },
    { id: 'c3', who: 'yuki', channel: 'instagram', handle: '@yuki.sound', daysLeft: 0, expired: true },
  ];

  window.DB = { CATEGORIES, INTERESTS, PROFILES, ME, byId, tag, INBOX, SENT, CONNECTIONS };
})();
