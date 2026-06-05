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
    P({ id: 'ipek', name: 'İpek', age: 25, city: 'Bornova, İzmir', dist: 42, gender: 'Woman',
      bio: 'Med student who lives for sea swims and bad puns.', online: true,
      about: 'I study hard and recover harder — usually in the Aegean. Looking for someone warm who can keep up with terrible jokes.',
      interests: ['Swimming', 'Coffee', 'Cinema', 'Hiking', 'Cats', 'Brunch'],
      channels: { instagram: { verified: true }, telegram: { verified: false } } }),
    P({ id: 'can', name: 'Can', age: 29, city: 'Kızılay, Ankara', dist: 39, gender: 'Man',
      bio: 'Software engineer, amateur potter, full-time tea drinker.',
      about: 'I build quiet software and loud playlists. Weekends at the wheel — the pottery kind. Tell me your comfort film.',
      interests: ['Ceramics', 'Tea', 'Startups', 'Chess', 'Jazz', 'Cycling'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
    P({ id: 'zoe', name: 'Zoë', age: 27, city: 'Jordaan, Amsterdam', dist: 2210, gender: 'Woman',
      bio: 'Illustrator. Bikes everywhere, draws everyone.',
      about: 'I sketch strangers on trains and call it research. Visiting İstanbul a lot this year. Looking for a museum-and-pancakes kind of person.',
      interests: ['Painting', 'Museums', 'Cycling', 'Bookshops', 'Natural wine', 'Slow travel'],
      channels: { instagram: { verified: true }, telegram: { verified: false } } }),
    P({ id: 'baris', name: 'Barış', age: 34, city: 'Beyoğlu, İstanbul', dist: 7, gender: 'Man',
      bio: 'Chef. I will absolutely judge your favourite restaurant — kindly.',
      about: 'I run a small kitchen in Beyoğlu and cook for friends on my days off. Looking for someone who eats with curiosity, not rules.',
      interests: ['Cooking', 'Street food', 'Wine', 'Live music', 'Travel', 'Dogs'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
    P({ id: 'hana', name: 'Hana', age: 26, city: 'Üsküdar, İstanbul', dist: 5, gender: 'Woman',
      bio: 'Translator between three languages and zero plants that survive.', online: true,
      about: 'Words are my whole life; succulents are my whole failure. I love long ferry rides and longer conversations.',
      interests: ['Languages', 'Poetry', 'Bookshops', 'Trains', 'Tea', 'Cinema'],
      channels: { instagram: { verified: false }, telegram: { verified: true } } }),
    P({ id: 'omar', name: 'Omar', age: 31, city: 'Neukölln, Berlin', dist: 1738, gender: 'Man',
      bio: 'DJ and daylight architect. Two very different jobs.',
      about: 'I design buildings that behave and parties that don’t. In İstanbul most months. Looking for someone who dances badly with confidence.',
      interests: ['Techno', 'Architecture', 'Vinyl bars', 'Dancing', 'Cocktails', 'Design'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
    P({ id: 'defne', name: 'Defne', age: 28, city: 'Bodrum, Muğla', dist: 360, gender: 'Woman',
      bio: 'Marine biologist. Happiest underwater.',
      about: 'I count fish for a living and it’s as good as it sounds. Looking for a land partner who doesn’t mind salty hair and early starts.',
      interests: ['Swimming', 'Camping', 'Climate', 'Photography', 'Islands', 'Early mornings'],
      channels: { instagram: { verified: true }, telegram: { verified: false } } }),
    P({ id: 'luca', name: 'Luca', age: 30, city: 'Beşiktaş, İstanbul', dist: 6, gender: 'Non-binary',
      bio: 'Game designer, board-game hoarder, gentle competitor.',
      about: 'I make small games about big feelings. My flat is 60% board games. Looking for someone to lose to, lovingly.',
      interests: ['Chess', 'Design', 'Cinema', 'Coffee', 'Writing', 'Cats'],
      channels: { instagram: { verified: true }, telegram: { verified: true } } }),
  ];

  // current user
  const ME = {
    id: 'me', name: 'You', age: 29, city: 'Kadıköy, İstanbul',
    gender: 'Woman', seeking: ['Man', 'Non-binary'],
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

  // default “interested in” by gender, then mutual matching uses both sides
  const defaultSeeking = (g) => g === 'Man' ? ['Woman', 'Non-binary'] : g === 'Woman' ? ['Man', 'Non-binary'] : ['Woman', 'Man', 'Non-binary'];
  PROFILES.forEach((p) => { if (!p.seeking) p.seeking = defaultSeeking(p.gender); });
  // demo flags for Discover tabs
  const NEW_TODAY = ['can', 'baris', 'luca', 'ipek', 'hana'];
  PROFILES.forEach((p) => { p.newToday = NEW_TODAY.includes(p.id); });
  ['devran', 'yuki', 'omar'].forEach((id) => { const p = byId(id); if (p) p.online = true; });
  // mutual gender-interest match: my gender is sought by them AND their gender is sought by me
  const mutualGender = (me, p) => (me.seeking || []).includes(p.gender) && (p.seeking || []).includes(me.gender);

  const CITIES = [
    'Kadıköy, İstanbul', 'Beşiktaş, İstanbul', 'Şişli, İstanbul', 'Beyoğlu, İstanbul', 'Üsküdar, İstanbul',
    'Bakırköy, İstanbul', 'Cihangir, İstanbul', 'Moda, İstanbul', 'Çankaya, Ankara', 'Keçiören, Ankara',
    'Karşıyaka, İzmir', 'Konak, İzmir', 'Bornova, İzmir', 'Çeşme, İzmir', 'Muratpaşa, Antalya',
    'Nilüfer, Bursa', 'Bodrum, Muğla', 'Selçuklu, Konya', 'Berlin, Germany', 'Kreuzberg, Berlin',
    'Amsterdam, Netherlands', 'London, UK', 'Paris, France',
  ];

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

  const NOTIFS = [
    { id: 'n1', kind: 'request', icon: 'inbox', title: 'New handle request', body: 'Arda asked to trade Instagram with you.', when: '2h', read: false },
    { id: 'n2', kind: 'connection', icon: 'link', title: 'Handle unlocked', body: 'You and Lena both shared Instagram.', when: '4d', read: false },
    { id: 'n3', kind: 'safety', icon: 'shield', title: 'A decision needs your attention', body: 'Your profile is on a visibility hold. You can appeal this decision.', when: '2d', read: false, appeal: true },
    { id: 'n4', kind: 'tip', icon: 'sparkle', title: 'Tip', body: 'Profiles with 4+ photos get more requests.', when: '1w', read: true },
  ];

  window.DB = { CATEGORIES, INTERESTS, PROFILES, ME, byId, tag, INBOX, SENT, CONNECTIONS, CITIES, mutualGender, NOTIFS };
})();
