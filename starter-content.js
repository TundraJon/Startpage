// Starter content for the Full/Lite first-run picker (Build 79+).
// Loaded as a plain global via its own <script> tag, before script.js, so seeding stays fully
// synchronous — no fetch(), no async gap between page load and first paint. script.js reads
// window.STARTER_CONTENT.full / .lite directly.
//
// Full content transcribed from full-starter-content.md (the user's own content master list),
// with the two corrections already resolved in that doc (First Watch excluded from the Brazil
// flag; only Azul/GOL flagged among the Travel section's airlines, not all seven). Every URL is
// a high-confidence real address for each named service, not independently verified live — this
// sandbox has no outbound network access (see README Build Queue history) — flagged for the
// user's own spot-check once this is live on a real network, per their own call.
//
// Category ids are kebab-case slugs; stripeColor is left null everywhere (exact palette choices
// were explicitly deferred to build time in the source doc — the user can color categories via
// the existing Category Color picker whenever they like). Tile ids are kebab-case, prefixed by
// their category for unique readability, not global uniqueness (tile ids only need to be unique
// within their own category's array, same as every other tile in this app).

(function () {
  function t(id, name, url) { return { id: id, name: name, url: url }; }
  function tb(id, name, url, blurb) { return { id: id, name: name, url: url, blurb: blurb }; }
  function tf(id, name, url) { return { id: id, name: name, url: url, brazil: true }; }
  function tfb(id, name, url, blurb) { return { id: id, name: name, url: url, blurb: blurb, brazil: true }; }
  function div(id, name) { return { id: id, type: 'divider', name: name }; }

  var full = { categories: {}, tiles: {} };
  var order = {};
  function addCat(id, name, parentId) {
    var p = parentId || null;
    var key = p || '__root__';
    order[key] = (order[key] || 0);
    full.categories[id] = { name: name, parentId: p, order: order[key]++, stripeColor: null };
  }

  // ---- Home ----
  full.tiles.home = [
    t('home-gmail', 'Gmail', 'https://mail.google.com'),
    t('home-translate', 'Google Translate', 'https://translate.google.com'),
    t('home-maps', 'Google Maps', 'https://maps.google.com'),
    t('home-usps', 'USPS', 'https://informeddelivery.usps.com'),
  ];

  // ---- Shopping ----
  addCat('shopping', 'Shopping', null);
  full.tiles.shopping = [
    t('shop-amazon', 'Amazon', 'https://www.amazon.com'),
    t('shop-walmart', 'Walmart', 'https://www.walmart.com'),
    t('shop-target', 'Target', 'https://www.target.com'),
    t('shop-costco', 'Costco', 'https://www.costco.com'),
    t('shop-kohls', "Kohl's", 'https://www.kohls.com'),
    t('shop-macys', "Macy's", 'https://www.macys.com'),
    t('shop-bestbuy', 'Best Buy', 'https://www.bestbuy.com'),
    t('shop-dollartree', 'Dollar Tree', 'https://www.dollartree.com'),
    div('shop-div-2', 'Cluster 2'),
    t('shop-ebay', 'eBay', 'https://www.ebay.com'),
    t('shop-wish', 'Wish', 'https://www.wish.com'),
    t('shop-temu', 'Temu', 'https://www.temu.com'),
    t('shop-aliexpress', 'AliExpress', 'https://www.aliexpress.com'),
    t('shop-woot', 'Woot!', 'https://www.woot.com'),
    div('shop-div-3', 'Cluster 3'),
    t('shop-wayfair', 'Wayfair', 'https://www.wayfair.com'),
    t('shop-bbb', 'Bed Bath & Beyond', 'https://www.bedbathandbeyond.com'),
    t('shop-homedepot', 'Home Depot', 'https://www.homedepot.com'),
    t('shop-lowes', "Lowe's", 'https://www.lowes.com'),
    t('shop-homegoods', 'HomeGoods', 'https://www.homegoods.com'),
    div('shop-div-4', 'Cluster 4'),
    t('shop-michaels', "Michael's", 'https://www.michaels.com'),
    t('shop-hobbylobby', 'Hobby Lobby', 'https://www.hobbylobby.com'),
    div('shop-div-5', 'Cluster 5'),
    t('shop-staples', 'Staples', 'https://www.staples.com'),
    div('shop-div-6', 'Cluster 6'),
    t('shop-etsy', 'Etsy', 'https://www.etsy.com'),
  ];

  // ---- News ----
  addCat('news', 'News', null);
  full.tiles.news = [
    t('news-fox', 'Fox News', 'https://www.foxnews.com'),
    t('news-usatoday', 'USA Today', 'https://www.usatoday.com'),
    t('news-yahoo', 'Yahoo News', 'https://news.yahoo.com'),
    t('news-google', 'Google News', 'https://news.google.com'),
    t('news-nypost', 'New York Post', 'https://nypost.com'),
    t('news-bbc', 'BBC', 'https://www.bbc.com/news'),
    t('news-reddit', 'Reddit', 'https://www.reddit.com'),
    t('news-cnet', 'CNET', 'https://www.cnet.com'),
    t('news-buzzfeed', 'BuzzFeed', 'https://www.buzzfeed.com'),
    t('news-reuters', 'Reuters', 'https://www.reuters.com'),
    t('news-ap', 'Associated Press', 'https://apnews.com'),
    t('news-tmz', 'TMZ', 'https://www.tmz.com'),
    t('news-people', 'People', 'https://people.com'),
    t('news-variety', 'Variety', 'https://variety.com'),
    t('news-ew', 'Entertainment Weekly', 'https://ew.com'),
    t('news-eonline', 'E! Online', 'https://www.eonline.com'),
  ];

  // ---- Weather ----
  addCat('weather-cat', 'Weather', null);
  full.tiles['weather-cat'] = [
    t('wxc-nws', 'National Weather Service', 'https://www.weather.gov'),
    t('wxc-twc', 'The Weather Channel', 'https://weather.com'),
    t('wxc-accuweather', 'AccuWeather', 'https://www.accuweather.com'),
    t('wxc-yahoo', 'Yahoo Weather', 'https://www.yahoo.com/news/weather'),
    t('wxc-wunderground', 'Weather Underground', 'https://www.wunderground.com'),
    t('wxc-foxweather', 'Fox Weather', 'https://www.foxweather.com'),
    t('wxc-timeanddate', 'Time and Date Weather', 'https://www.timeanddate.com/weather/'),
    t('wxc-weatherbug', 'WeatherBug', 'https://www.weatherbug.com'),
    t('wxc-intellicast', 'Intellicast', 'https://www.intellicast.com'),
    t('wxc-msn', 'MSN Weather', 'https://www.msn.com/en-us/weather'),
    t('wxc-windy', 'Windy.com', 'https://www.windy.com'),
    t('wxc-ventusky', 'Ventusky', 'https://www.ventusky.com'),
    t('wxc-noaa', 'NOAA', 'https://www.noaa.gov'),
    t('wxc-spaceweather', 'Space Weather', 'https://spaceweather.com'),
    t('wxc-aurora', 'NOAA Aurora Forecast', 'https://www.swpc.noaa.gov/products/aurora-30-minute-forecast'),
    t('wxc-ecmwf', 'ECMWF', 'https://www.ecmwf.int'),
    t('wxc-timeanddate2', 'Time and Date', 'https://www.timeanddate.com'),
  ];

  // ---- Movies / Streaming ----
  addCat('streaming', 'Movies / Streaming', null);
  full.tiles.streaming = [
    t('str-netflix', 'Netflix', 'https://www.netflix.com'),
    t('str-primevideo', 'Prime Video', 'https://www.primevideo.com'),
    t('str-imdb', 'IMDb', 'https://www.imdb.com'),
    t('str-youtube', 'YouTube', 'https://www.youtube.com'),
    t('str-tubi', 'Tubi', 'https://tubitv.com'),
    t('str-plex', 'Plex', 'https://www.plex.tv'),
    t('str-crackle', 'Crackle', 'https://www.crackle.com'),
    tf('str-globoplay', 'Globoplay', 'https://globoplay.globo.com'),
    t('str-plutotv', 'Pluto TV', 'https://pluto.tv'),
  ];

  // ---- Social Media & Chat ----
  addCat('social', 'Social Media & Chat', null);
  full.tiles.social = [
    t('soc-facebook', 'Facebook', 'https://www.facebook.com'),
    t('soc-instagram', 'Instagram', 'https://www.instagram.com'),
    t('soc-pinterest', 'Pinterest', 'https://www.pinterest.com'),
    t('soc-messenger', 'Messenger', 'https://www.messenger.com'),
    t('soc-reddit', 'Reddit', 'https://www.reddit.com'),
    t('soc-linkedin', 'LinkedIn', 'https://www.linkedin.com'),
    t('soc-tiktok', 'TikTok', 'https://www.tiktok.com'),
    t('soc-snapchat', 'Snapchat', 'https://www.snapchat.com'),
    t('soc-whatsapp', 'WhatsApp', 'https://web.whatsapp.com'),
    t('soc-meetup', 'Meetup', 'https://www.meetup.com'),
    t('soc-ancestry', 'Ancestry', 'https://www.ancestry.com'),
    t('soc-discord', 'Discord', 'https://discord.com'),
    t('soc-steam', 'Steam', 'https://store.steampowered.com'),
    t('soc-googlechat', 'Google Chat', 'https://chat.google.com'),
  ];

  // ---- Games (deep subtree) ----
  addCat('games', 'Games', null);
  full.tiles.games = [
    t('games-crazygames', 'CrazyGames', 'https://www.crazygames.com'),
    t('games-coolmath', 'Coolmath Games', 'https://www.coolmathgames.com'),
    t('games-bigfish', 'Big Fish Games', 'https://www.bigfishgames.com'),
    t('games-nytgames', 'NYT Games', 'https://www.nytimes.com/games'),
    t('games-bgg', 'BoardGameGeek', 'https://boardgamegeek.com'),
    t('games-gamerant', 'GameRant', 'https://gamerant.com'),
    t('games-epic', 'Epic Games', 'https://www.epicgames.com'),
    t('games-ea', 'EA Games', 'https://www.ea.com'),
  ];

  addCat('games-rpg', 'RPG', 'games');
  full.tiles['games-rpg'] = [
    t('rpg-roll20', 'Roll20', 'https://roll20.net'),
    t('rpg-owlbear', 'Owlbear Rodeo', 'https://www.owlbear.rodeo'),
    t('rpg-dndbeyond', 'D&D Beyond', 'https://www.dndbeyond.com'),
    t('rpg-pathbuilder', 'Pathbuilder 2e', 'https://pathbuilder2e.com'),
    t('rpg-herolab', 'Hero Lab', 'https://www.wolflair.com/hero_lab/'),
    t('rpg-pcgen', 'PCGen', 'https://pcgen.org'),
    t('rpg-fightclub5e', 'Fight Club 5th Edition', 'https://www.fifthedition.com'),
    t('rpg-aurorabuilder', 'Aurora Builder', 'https://www.aurorabuilder.com'),
    t('rpg-gmbinder', 'GM Binder', 'https://www.gmbinder.com'),
    t('rpg-homebrewery', 'Homebrewery', 'https://homebrewery.naturalcrit.com'),
    t('rpg-drivethrurpg', 'DriveThruRPG', 'https://www.drivethrurpg.com'),
    t('rpg-dmsguild', 'DMs Guild', 'https://www.dmsguild.com'),
    t('rpg-itchio', 'itch.io', 'https://itch.io'),
    t('rpg-kickstarter', 'Kickstarter', 'https://www.kickstarter.com'),
    t('rpg-criticalrole', 'Critical Role', 'https://critrole.com'),
    t('rpg-dimension20', 'Dimension 20', 'https://www.dropout.tv/dimension-20'),
    t('rpg-theguild', 'The Guild', 'https://www.theguildshow.com'),
    t('rpg-mongoose', 'Mongoose Publishing', 'https://www.mongoosepublishing.com'),
    t('rpg-fantasyflight', 'Fantasy Flight Games', 'https://www.fantasyflightgames.com'),
    t('rpg-asmodee', 'Asmodee', 'https://www.asmodee.com'),
    t('rpg-avalonhill', 'Hasbro/Avalon Hill', 'https://avalonhill.hasbro.com'),
    t('rpg-paizo', 'Paizo', 'https://paizo.com'),
    t('rpg-wotc', 'Wizards of the Coast', 'https://www.wizards.com'),
    t('rpg-tycoongames', 'Tycoon Games', 'https://www.tycoongames.com'),
    t('rpg-cmon', 'CMON', 'https://cmon.com'),
    t('rpg-sjgames', 'Steve Jackson Games', 'https://www.sjgames.com'),
    t('rpg-chaosium', 'Chaosium', 'https://www.chaosium.com'),
  ];

  addCat('games-rpg-tools', 'Tools', 'games-rpg');
  full.tiles['games-rpg-tools'] = [
    t('rpgt-donjon', 'Donjon', 'https://donjon.bin.sh'),
    t('rpgt-worldanvil', 'World Anvil', 'https://www.worldanvil.com'),
    t('rpgt-inkarnate', 'Inkarnate', 'https://inkarnate.com'),
    t('rpgt-fantasynames', 'Fantasy Name Generators', 'https://www.fantasynamegenerators.com'),
    t('rpgt-chaoticshiny', 'Chaotic Shiny', 'https://chaoticshiny.com'),
    t('rpgt-perchance', 'Perchance', 'https://perchance.org'),
    t('rpgt-dungeonscrawl', 'Dungeon Scrawl', 'https://dungeonscrawl.com'),
    t('rpgt-azgaar', "Azgaar's Fantasy Map Generator", 'https://azgaar.github.io/Fantasy-Map-Generator/'),
    t('rpgt-dndroller', 'DnD Dice Roller', 'https://www.dndbeyond.com/dice'),
  ];

  addCat('games-rpg-minis', 'Miniatures', 'games-rpg');
  full.tiles['games-rpg-minis'] = [
    t('rpgm-gamesworkshop', 'Games Workshop', 'https://www.games-workshop.com'),
    t('rpgm-reaper', 'Reaper Miniatures', 'https://www.reapermini.com'),
    t('rpgm-wizkids', 'WizKids', 'https://wizkids.com'),
    t('rpgm-privateer', 'Privateer Press', 'https://privateerpress.com'),
    t('rpgm-mantic', 'Mantic Games', 'https://www.manticgames.com'),
    t('rpgm-wyrd', 'Wyrd', 'https://www.wyrd-games.net'),
    t('rpgm-nobleknight', 'Noble Knight Games', 'https://www.nobleknight.com'),
    t('rpgm-miniaturemarket', 'Miniature Market', 'https://www.miniaturemarket.com'),
    tb('rpgm-etsy', 'Etsy', 'https://www.etsy.com/search?q=rpg+miniatures', 'Saved search link, not a curated storefront — jumps straight to a search for RPG miniatures; results vary by independent seller.'),
    t('rpgm-chessex', 'Chessex', 'https://www.chessex.com'),
    t('rpgm-qworkshop', 'Q Workshop', 'https://www.q-workshop.com'),
    t('rpgm-easyroller', 'Easy Roller Dice Co.', 'https://www.easyrollerdice.com'),
  ];

  addCat('games-rpg-misc', 'Misc', 'games-rpg');
  full.tiles['games-rpg-misc'] = [
    t('rpgmisc-bgquest', 'BoardGame Quest', 'https://www.boardgamequest.com'),
    t('rpgmisc-yeoldeinn', 'Ye Olde Inn', 'https://www.yeoldeinn.com'),
  ];

  addCat('games-rpg-maps', 'Battle Maps', 'games-rpg');
  full.tiles['games-rpg-maps'] = [
    div('maps-div-free', 'Free'),
    t('maps-2mintt', '2-Minute Tabletop', 'https://2minutetabletop.com'),
    t('maps-cartographersguild', "Cartographer's Guild", 'https://www.cartographersguild.com'),
    t('maps-dyson', "Dyson's Dodecahedron", 'https://dysonlogos.blog'),
    t('maps-forgottenadv', 'Forgotten Adventures', 'https://www.forgotten-adventures.net'),
    t('maps-madcarto', 'The Mad Cartographer', 'https://www.themadcartographer.com'),
    t('maps-pinterest', 'Pinterest (Battle Maps)', 'https://www.pinterest.com/search/pins/?q=battle%20maps'),
    div('maps-div-paid', 'Paid'),
    t('maps-afternoon', 'Afternoon Maps', 'https://www.patreon.com/afternoonmaps'),
    t('maps-crosshead', 'Crosshead Studios', 'https://www.crossheadstudios.com'),
    t('maps-czepeku', 'Czepeku', 'https://czepeku.com'),
    t('maps-demartini', 'DeMartini Designs', 'https://www.patreon.com/demartinidesigns'),
    t('maps-fantasyatlas', 'Fantasy Atlas', 'https://www.patreon.com/fantasyatlas'),
    t('maps-paizo', 'Paizo (Flip-Mats)', 'https://paizo.com/pathfinder/flip-mat'),
  ];

  addCat('games-3d', '3D Models', 'games');
  full.tiles['games-3d'] = [
    t('3d-thingiverse', 'Thingiverse', 'https://www.thingiverse.com'),
    t('3d-printables', 'Printables', 'https://www.printables.com'),
    t('3d-myminifactory', 'MyMiniFactory', 'https://www.myminifactory.com'),
    t('3d-cults3d', 'Cults3D', 'https://cults3d.com'),
    t('3d-thangs', 'Thangs', 'https://thangs.com'),
    t('3d-makerworld', 'MakerWorld', 'https://makerworld.com'),
    t('3d-grabcad', 'GrabCAD', 'https://grabcad.com'),
    t('3d-sketchfab', 'Sketchfab', 'https://sketchfab.com'),
    t('3d-polypizza', 'Poly Pizza', 'https://poly.pizza'),
    t('3d-meshy', 'Meshy', 'https://www.meshy.ai'),
    t('3d-tripo', 'Tripo', 'https://www.tripo3d.ai'),
    t('3d-rodin', 'Rodin', 'https://hyper3d.ai'),
    t('3d-aistudio', '3D AI Studio', 'https://3daistudio.com'),
    t('3d-heroforge', 'Hero Forge', 'https://www.heroforge.com'),
    t('3d-titanforge', 'Titan-Forge Miniatures', 'https://www.titanforgeminiatures.com'),
    t('3d-eldritchfoundry', 'Eldritch Foundry', 'https://eldritchfoundry.com'),
  ];

  addCat('games-computer', 'Computer/Video Games', 'games');
  full.tiles['games-computer'] = [
    t('cg-steam', 'Steam', 'https://store.steampowered.com'),
    t('cg-bethesda', 'Bethesda', 'https://bethesda.net'),
    t('cg-valve', 'Valve', 'https://www.valvesoftware.com'),
    t('cg-blizzard', 'Blizzard/Activision', 'https://www.blizzard.com'),
    t('cg-ubisoft', 'Ubisoft', 'https://www.ubisoft.com'),
    t('cg-rockstar', 'Rockstar Games', 'https://www.rockstargames.com'),
    t('cg-microsoft', 'Microsoft Games', 'https://www.xbox.com/games'),
  ];

  // ---- Automotive ----
  addCat('automotive', 'Automotive', null);
  full.tiles.automotive = [
    t('auto-caranddriver', 'Car and Driver', 'https://www.caranddriver.com'),
    t('auto-autozone', 'AutoZone', 'https://www.autozone.com'),
    t('auto-kbb', 'Kelley Blue Book', 'https://www.kbb.com'),
    t('auto-aaa', 'AAA', 'https://www.aaa.com'),
    t('auto-edmunds', 'Edmunds', 'https://www.edmunds.com'),
    t('auto-carfax', 'Carfax', 'https://www.carfax.com'),
    t('auto-uber', 'Uber', 'https://www.uber.com'),
    t('auto-avis', 'Avis', 'https://www.avis.com'),
    t('auto-enterprise', 'Enterprise', 'https://www.enterprise.com'),
    t('auto-carid', 'CARiD', 'https://www.carid.com'),
    t('auto-mavis', 'Mavis', 'https://www.mavis.com'),
    t('auto-jeep', 'Jeep.com', 'https://www.jeep.com'),
  ];

  // ---- Food & Cooking ----
  addCat('food', 'Food & Cooking', null);
  full.tiles.food = [
    div('food-div-recipes', 'Recipes'),
    t('food-allrecipes', 'AllRecipes', 'https://www.allrecipes.com'),
    t('food-foodnetwork', 'Food Network', 'https://www.foodnetwork.com'),
    t('food-cookingchannel', 'Cooking Channel', 'https://www.cookingchanneltv.com'),
    t('food-bonappetit', 'Bon Appétit', 'https://www.bonappetit.com'),
    div('food-div-delivery', 'Food Delivery'),
    t('food-doordash', 'DoorDash', 'https://www.doordash.com'),
    t('food-ubereats', 'Uber Eats', 'https://www.ubereats.com'),
    t('food-grubhub', 'GrubHub', 'https://www.grubhub.com'),
    t('food-instacart', 'Instacart', 'https://www.instacart.com'),
    t('food-dominos', "Domino's", 'https://www.dominos.com'),
    div('food-div-dining', 'Dining Out'),
    t('food-opentable', 'OpenTable', 'https://www.opentable.com'),
    div('food-div-groceries', 'Groceries'),
    t('food-publix', 'Publix', 'https://www.publix.com'),
    t('food-target', 'Target', 'https://www.target.com'),
    t('food-walmart', 'Walmart', 'https://www.walmart.com'),
    t('food-costco', 'Costco', 'https://www.costco.com'),
    t('food-aldi', 'Aldi', 'https://www.aldi.us'),
    div('food-div-fastfood', 'Fast Food'),
    t('food-mcdonalds', "McDonald's", 'https://www.mcdonalds.com'),
    t('food-culvers', "Culver's", 'https://www.culvers.com'),
    t('food-rockyrococo', 'Rocky Rococo', 'https://www.rockyrococo.com'),
    t('food-chickfila', 'Chick-fil-A', 'https://www.chick-fil-a.com'),
    t('food-wendys', "Wendy's", 'https://www.wendys.com'),
    t('food-tacobell', 'Taco Bell', 'https://www.tacobell.com'),
    t('food-chipotle', 'Chipotle', 'https://www.chipotle.com'),
    t('food-burgerking', 'Burger King', 'https://www.bk.com'),
    t('food-subway', 'Subway', 'https://www.subway.com'),
    t('food-panera', 'Panera', 'https://www.panerabread.com'),
    t('food-fiveguys', 'Five Guys', 'https://www.fiveguys.com'),
    t('food-innout', 'In-N-Out', 'https://www.in-n-out.com'),
    t('food-popeyes', 'Popeyes', 'https://www.popeyes.com'),
    t('food-arbys', "Arby's", 'https://arbys.com'),
    t('food-sonic', 'Sonic', 'https://www.sonicdrivein.com'),
    t('food-jimmyjohns', "Jimmy John's", 'https://www.jimmyjohns.com'),
    t('food-pandaexpress', 'Panda Express', 'https://www.pandaexpress.com'),
    div('food-div-findrest', 'Find a Restaurant'),
    t('food-yelp', 'Yelp', 'https://www.yelp.com'),
    t('food-tripadvisor', 'TripAdvisor Restaurants', 'https://www.tripadvisor.com/Restaurants'),
    t('food-infatuation', 'The Infatuation', 'https://www.theinfatuation.com'),
  ];

  // ---- Health & Beauty ----
  addCat('health', 'Health & Beauty', null);
  full.tiles.health = [
    div('health-div-health', 'Health'),
    t('hb-webmd', 'WebMD', 'https://www.webmd.com'),
    t('hb-cvs', 'CVS', 'https://www.cvs.com'),
    t('hb-walgreens', 'Walgreens', 'https://www.walgreens.com'),
    t('hb-caredotcom', 'Care.com', 'https://www.care.com'),
    t('hb-cdc', 'CDC', 'https://www.cdc.gov'),
    t('hb-zocdoc', 'Zocdoc', 'https://www.zocdoc.com'),
    t('hb-healthcaregov', 'Healthcare.gov', 'https://www.healthcare.gov'),
    t('hb-mychart', 'MyChart', 'https://mychart.com'),
    t('hb-goodrx', 'GoodRx', 'https://www.goodrx.com'),
    t('hb-psychtoday', 'Psychology Today', 'https://www.psychologytoday.com'),
    t('hb-mayoclinic', 'Mayo Clinic', 'https://www.mayoclinic.org'),
    t('hb-drugscom', 'Drugs.com', 'https://www.drugs.com'),
    t('hb-who', 'WHO', 'https://www.who.int'),
    div('health-div-beauty', 'Beauty'),
    t('hb-sephora', 'Sephora', 'https://www.sephora.com'),
    t('hb-ulta', 'Ulta', 'https://www.ulta.com'),
    t('hb-sallybeauty', 'Sally Beauty', 'https://www.sallybeauty.com'),
    t('hb-bathbodyworks', 'Bath & Body Works', 'https://www.bathandbodyworks.com'),
    t('hb-dermstore', 'Dermstore', 'https://www.dermstore.com'),
    t('hb-elf', 'e.l.f. Cosmetics', 'https://www.elfcosmetics.com'),
    t('hb-lush', 'Lush', 'https://www.lushusa.com'),
  ];

  // ---- Computer & Tech ----
  addCat('tech', 'Computer & Tech', null);
  full.tiles.tech = [
    t('tech-tomsguide', "Tom's Guide", 'https://www.tomsguide.com'),
    t('tech-pcmag', 'PC Magazine', 'https://www.pcmag.com'),
    t('tech-pcworld', 'PCWorld', 'https://www.pcworld.com'),
    t('tech-cnet', 'CNET', 'https://www.cnet.com'),
    t('tech-techradar', 'TechRadar', 'https://www.techradar.com'),
    t('tech-zdnet', 'ZDNet', 'https://www.zdnet.com'),
    t('tech-wired', 'Wired', 'https://www.wired.com'),
    t('tech-verge', 'The Verge', 'https://www.theverge.com'),
    t('tech-digitaltrends', 'Digital Trends', 'https://www.digitaltrends.com'),
    t('tech-lifehacker', 'Lifehacker', 'https://lifehacker.com'),
    t('tech-androidauthority', 'Android Authority', 'https://www.androidauthority.com'),
    t('tech-androiddotcom', 'Android.com', 'https://www.android.com'),
  ];
  addCat('tech-stores', 'Stores', 'tech');
  full.tiles['tech-stores'] = [
    t('techs-newegg', 'Newegg', 'https://www.newegg.com'),
    t('techs-bestbuy', 'Best Buy', 'https://www.bestbuy.com'),
    t('techs-microcenter', 'Micro Center', 'https://www.microcenter.com'),
    t('techs-bhphoto', 'B&H Photo', 'https://www.bhphotovideo.com'),
  ];
  addCat('tech-manufacturers', 'Manufacturers', 'tech');
  full.tiles['tech-manufacturers'] = [
    t('techm-acer', 'Acer', 'https://www.acer.com'),
    t('techm-apple', 'Apple', 'https://www.apple.com'),
    t('techm-asus', 'ASUS', 'https://www.asus.com'),
    t('techm-dell', 'Dell', 'https://www.dell.com'),
    t('techm-google', 'Google', 'https://store.google.com'),
    t('techm-hp', 'HP', 'https://www.hp.com'),
    t('techm-lg', 'LG', 'https://www.lg.com'),
    t('techm-microsoft', 'Microsoft', 'https://www.microsoft.com'),
    t('techm-samsung', 'Samsung', 'https://www.samsung.com'),
    t('techm-sony', 'Sony', 'https://www.sony.com'),
  ];
  addCat('tech-remote', 'Remote Access', 'tech');
  full.tiles['tech-remote'] = [
    t('techr-teamviewer', 'TeamViewer', 'https://www.teamviewer.com'),
    t('techr-anydesk', 'AnyDesk', 'https://anydesk.com'),
    t('techr-chromedesktop', 'Chrome Remote Desktop', 'https://remotedesktop.google.com'),
    t('techr-splashtop', 'Splashtop', 'https://www.splashtop.com'),
    t('techr-logmein', 'LogMeIn', 'https://www.logmein.com'),
  ];

  // ---- Mobile & Phone ----
  addCat('mobile', 'Mobile & Phone', null);
  full.tiles.mobile = [
    div('mobile-div-carriers', 'Carriers'),
    t('mob-tmobile', 'T-Mobile', 'https://www.t-mobile.com'),
    t('mob-verizon', 'Verizon', 'https://www.verizon.com'),
    t('mob-visible', 'Visible', 'https://www.visible.com'),
    t('mob-mintmobile', 'Mint Mobile', 'https://www.mintmobile.com'),
    t('mob-googlefi', 'Google Fi', 'https://fi.google.com'),
    div('mobile-div-tracking', 'Device Tracking'),
    t('mob-findmydevice', 'Google Find My Device', 'https://android.com/find'),
    t('mob-applefindmy', 'Apple Find My', 'https://www.icloud.com/find'),
    div('mobile-div-manufacturers', 'Phone Manufacturers'),
    t('mob-google', 'Google', 'https://store.google.com/category/phones'),
    t('mob-apple', 'Apple', 'https://www.apple.com/iphone/'),
    t('mob-motorola', 'Motorola', 'https://www.motorola.com'),
    t('mob-nokia', 'Nokia', 'https://www.nokia.com/phones/'),
    t('mob-oneplus', 'OnePlus', 'https://www.oneplus.com'),
    t('mob-samsung', 'Samsung', 'https://www.samsung.com/us/smartphones/'),
    t('mob-tcl', 'TCL', 'https://www.tcl.com'),
    t('mob-xiaomi', 'Xiaomi', 'https://www.mi.com'),
    div('mobile-div-esim', 'eSIMs'),
    tb('esim-airalo', 'Airalo', 'https://www.airalo.com', 'Largest marketplace, broadest country selection — good general default for most trips.'),
    tb('esim-holafly', 'Holafly', 'https://esim.holafly.com', "Unlimited data plans — best for short trips where you don't want to think about data caps."),
    tb('esim-nomad', 'Nomad', 'https://www.getnomad.app', 'Flexible prepaid plans — good value specifically for Europe trips.'),
    tb('esim-saily', 'Saily', 'https://saily.com', 'Budget-friendly, built by the NordVPN team — good if security/privacy matters to you.'),
    tb('esim-ubigi', 'Ubigi', 'https://www.ubigi.com', 'Best for frequent or long-term travelers — especially strong Japan/South Korea coverage.'),
    tb('esim-gigsky', 'GigSky', 'https://www.gigsky.com', 'Built specifically for cruise ship connectivity — covers 280+ ships across most major cruise lines (Royal Caribbean, Carnival, Norwegian, Disney, etc.); check your specific ship before booking, coverage varies ship-by-ship.'),
    tb('esim-appleguide', 'Apple eSIM Setup Guide', 'https://support.apple.com/en-us/HT209044', 'Official Apple instructions for activating an eSIM on iPhone.'),
    tb('esim-androidguide', 'Android eSIM Setup Guide', 'https://support.google.com/pixelphone/answer/9448523', 'General Android eSIM setup instructions (varies somewhat by manufacturer).'),
  ];

  // ---- AI Chatbots ----
  addCat('ai-chatbots', 'AI Chatbots', null);
  full.tiles['ai-chatbots'] = [
    tb('ai-chatgpt', 'ChatGPT', 'https://chatgpt.com', 'Most versatile all-rounder — strong at writing, brainstorming, broad general knowledge, huge plugin/GPT ecosystem.'),
    tb('ai-gemini', 'Google Gemini', 'https://gemini.google.com', 'Deep integration with Google services (Docs, Gmail, Sheets) — strong at multimodal tasks (images, video).'),
    tb('ai-claude', 'Claude', 'https://claude.ai', 'Excels at programming/coding, plus longer, nuanced writing and analysis — often praised for careful reasoning and thoughtful responses on sensitive topics.'),
    tb('ai-grok', 'Grok', 'https://grok.com', 'Real-time access to X (Twitter) data — more casual/irreverent tone, good for current events/trending topics.'),
    tb('ai-deepseek', 'DeepSeek', 'https://www.deepseek.com', 'Excels at math, coding, and technical reasoning — free and open-source.'),
    tb('ai-perplexity', 'Perplexity', 'https://www.perplexity.ai', 'Built specifically as an AI-powered search engine — best for research with cited sources.'),
    tb('ai-copilot', 'Microsoft Copilot', 'https://copilot.microsoft.com', 'Deep integration with Microsoft 365 (Word, Excel, Outlook) — good for office/work-document tasks.'),
  ];

  // ---- Video Calling ----
  addCat('videocalling', 'Video Calling', null);
  full.tiles.videocalling = [
    t('vc-zoom', 'Zoom', 'https://zoom.us'),
    t('vc-webex', 'Webex', 'https://www.webex.com'),
    t('vc-gotomeeting', 'GoToMeeting', 'https://www.goto.com/meeting'),
  ];

  // ---- Art ----
  addCat('art', 'Art', null);
  full.tiles.art = [
    div('art-div-classical', 'Old Masters / Classical'),
    t('art-britishmuseum', 'British Museum', 'https://www.britishmuseum.org'),
    t('art-getty', 'Getty Museum', 'https://www.getty.edu'),
    t('art-googlearts', 'Google Arts & Culture', 'https://artsandculture.google.com'),
    t('art-nglondon', 'National Gallery (London)', 'https://www.nationalgallery.org.uk'),
    t('art-ngdc', 'National Gallery of Art (DC)', 'https://www.nga.gov'),
    t('art-rijksmuseum', 'Rijksmuseum', 'https://www.rijksmuseum.nl'),
    t('art-louvre', 'The Louvre', 'https://www.louvre.fr'),
    t('art-met', 'The Met', 'https://www.metmuseum.org'),
    t('art-wga', 'Web Gallery of Art', 'https://www.wga.hu'),
    div('art-div-modern', 'Modern/Digital'),
    t('art-artstation', 'ArtStation', 'https://www.artstation.com'),
    t('art-deviantart', 'DeviantArt', 'https://www.deviantart.com'),
    div('art-div-marketplaces', 'Marketplaces'),
    t('art-artsy', 'Artsy', 'https://www.artsy.net'),
    t('art-etsy', 'Etsy', 'https://www.etsy.com'),
    t('art-saatchi', 'Saatchi Art', 'https://www.saatchiart.com'),
  ];

  // ---- Photos & Images ----
  addCat('photos', 'Photos & Images', null);
  full.tiles.photos = [
    tb('photo-dpreview', 'DPReview', 'https://www.dpreview.com', 'Camera/gear reviews and news.'),
    tb('photo-500px', '500px', 'https://500px.com', 'Professional photography community and portfolio showcase.'),
    tb('photo-dcw', 'Digital Camera World', 'https://www.digitalcameraworld.com', 'Photography news, gear reviews, tutorials.'),
    tb('photo-flickr', 'Flickr', 'https://www.flickr.com', 'Photo sharing and storage, large community.'),
    tb('photo-photobucket', 'Photobucket', 'https://photobucket.com', 'Photo hosting and storage.'),
    tb('photo-pixlr', 'Pixlr', 'https://pixlr.com', 'Free browser-based photo editor.'),
    tb('photo-unsplash', 'Unsplash', 'https://unsplash.com', "Free, no attribution required (though appreciated), free for commercial use; can't be scraped to build a competing stock-photo service. No site guarantees a model release — if a photo shows a recognizable person, you're responsible for getting their consent before commercial use."),
    tb('photo-pexels', 'Pexels', 'https://www.pexels.com', 'Free, no attribution required, CC0-style license, free for commercial use.'),
    tb('photo-pixabay', 'Pixabay', 'https://pixabay.com', 'Free, no attribution required; explicitly allows AI/machine-learning training use (contributors can opt out).'),
    tb('photo-stocksnap', 'StockSnap', 'https://stocksnap.io', 'Free, CC0 public domain, no attribution required, no restrictions on use.'),
    div('photo-div-printing', 'Photo Printing'),
    t('photop-shutterfly', 'Shutterfly', 'https://www.shutterfly.com'),
    t('photop-snapfish', 'Snapfish', 'https://www.snapfish.com'),
    t('photop-walgreens', 'Walgreens Photo', 'https://photo.walgreens.com'),
    t('photop-cvs', 'CVS Photo', 'https://www.cvs.com/photo'),
    t('photop-walmart', 'Walmart Photo', 'https://www.walmartphoto.com'),
    t('photop-costco', 'Costco Photo Center', 'https://www.costcophotocenter.com'),
  ];

  // ---- Fashion & Clothing ----
  addCat('fashion', 'Fashion & Clothing', null);
  full.tiles.fashion = [
    t('fash-shein', 'SHEIN', 'https://www.shein.com'),
    t('fash-walmart', 'Walmart', 'https://www.walmart.com'),
    t('fash-ross', 'Ross', 'https://www.rossstores.com'),
    t('fash-tjmaxx', 'TJ Maxx', 'https://tjmaxx.tjx.com'),
    t('fash-marshalls', 'Marshalls', 'https://www.marshalls.com'),
    tb('fash-uniqlo', 'UNIQLO', 'https://www.uniqlo.com', 'Japanese basics brand — HEATTECH thermals, simple everyday staples; higher quality than typical fast fashion, still affordable.'),
    t('fash-target', 'Target', 'https://www.target.com'),
    t('fash-kohls', "Kohl's", 'https://www.kohls.com'),
    t('fash-forever21', 'Forever 21', 'https://www.forever21.com'),
    t('fash-hm', 'H&M', 'https://www2.hm.com'),
    t('fash-poshmark', 'Poshmark', 'https://poshmark.com'),
    t('fash-express', 'Express', 'https://www.express.com'),
    t('fash-gap', 'GAP', 'https://www.gap.com'),
    t('fash-jcrew', 'J.Crew', 'https://www.jcrew.com'),
    t('fash-loft', 'LOFT', 'https://www.loft.com'),
    t('fash-zara', 'Zara', 'https://www.zara.com'),
    t('fash-nordstromrack', 'Nordstrom Rack', 'https://www.nordstromrack.com'),
    t('fash-macys', "Macy's", 'https://www.macys.com'),
    t('fash-nordstrom', 'Nordstrom', 'https://www.nordstrom.com'),
    div('fash-div-styling', 'Subscription Styling'),
    tb('fash-stitchfix', 'Stitch Fix', 'https://www.stitchfix.com', 'A stylist picks 5 items based on your style quiz; you only pay for what you keep, return the rest free.'),
    tb('fash-wantable', 'Wantable', 'https://www.wantable.com', 'Similar concept, curated box based on a style quiz — compare fees/return policy against Stitch Fix before choosing between them.'),
  ];

  // ---- Humor & Fun ----
  addCat('humor', 'Humor & Fun', null);
  full.tiles.humor = [
    t('hum-redditfunny', 'Reddit r/funny', 'https://www.reddit.com/r/funny'),
    t('hum-giphy', 'GIPHY', 'https://giphy.com'),
    t('hum-9gag', '9GAG', 'https://9gag.com'),
    t('hum-imgurfunny', 'Imgur Funny', 'https://imgur.com/r/funny'),
    t('hum-buzzfeedlol', 'BuzzFeed LOL', 'https://www.buzzfeed.com/lol'),
    t('hum-onion', 'The Onion', 'https://theonion.com'),
    t('hum-boredpanda', 'Bored Panda', 'https://www.boredpanda.com'),
    t('hum-comedycentral', 'Comedy Central', 'https://www.cc.com'),
    t('hum-cheezburger', 'Cheezburger', 'https://cheezburger.com'),
    t('hum-xkcd', 'xkcd', 'https://xkcd.com'),
    t('hum-tenor', 'Tenor', 'https://tenor.com'),
    t('hum-cracked', 'Cracked', 'https://www.cracked.com'),
    t('hum-dorktower', 'Dork Tower', 'https://dorktower.com'),
  ];

  // ---- Tickets & Events ----
  addCat('tickets', 'Tickets & Events', null);
  full.tiles.tickets = [
    t('tix-ticketmaster', 'Ticketmaster', 'https://www.ticketmaster.com'),
    t('tix-stubhub', 'StubHub', 'https://www.stubhub.com'),
    t('tix-fandango', 'Fandango', 'https://www.fandango.com'),
    t('tix-eventbrite', 'Eventbrite', 'https://www.eventbrite.com'),
    t('tix-seatgeek', 'SeatGeek', 'https://seatgeek.com'),
    t('tix-livenation', 'Live Nation', 'https://www.livenation.com'),
    t('tix-vividseats', 'Vivid Seats', 'https://www.vividseats.com'),
    t('tix-bandsintown', 'Bandsintown', 'https://www.bandsintown.com'),
    t('tix-amc', 'AMC Theatres', 'https://www.amctheatres.com'),
    t('tix-cinemark', 'Cinemark', 'https://www.cinemark.com'),
  ];

  // ---- Printing & Office Services ----
  addCat('printing', 'Printing & Office Services', null);
  full.tiles.printing = [
    t('print-vistaprint', 'Vistaprint', 'https://www.vistaprint.com'),
    t('print-moo', 'MOO', 'https://www.moo.com'),
    t('print-gotprint', 'GotPrint', 'https://www.gotprint.com'),
    t('print-fedexoffice', 'FedEx Office', 'https://www.fedex.com/en-us/office.html'),
    t('print-upsstore', 'UPS Store', 'https://www.theupsstore.com'),
    t('print-officedepot', 'Office Depot/OfficeMax', 'https://www.officedepot.com'),
    t('print-staples', 'Staples', 'https://www.staples.com'),
  ];

  // ---- Music ----
  addCat('music', 'Music', null);
  full.tiles.music = [
    t('music-amazonmusic', 'Amazon Music', 'https://music.amazon.com'),
    t('music-pandora', 'Pandora', 'https://www.pandora.com'),
    t('music-spotify', 'Spotify', 'https://www.spotify.com'),
    t('music-iheartradio', 'iHeartRadio', 'https://www.iheart.com'),
    t('music-tunein', 'TuneIn Radio', 'https://tunein.com'),
    t('music-soundcloud', 'SoundCloud', 'https://soundcloud.com'),
    t('music-youtubemusic', 'YouTube Music', 'https://music.youtube.com'),
    t('music-deezer', 'Deezer', 'https://www.deezer.com'),
    t('music-azlyrics', 'AZLyrics', 'https://www.azlyrics.com'),
    t('music-suno', 'Suno', 'https://suno.com'),
  ];

  // ---- Orlando ----
  addCat('orlando', 'Orlando', null);
  full.tiles.orlando = [
    div('orl-div-attractions', 'Attractions'),
    t('orl-wdw', 'Walt Disney World', 'https://www.disneyworld.com'),
    t('orl-universal', 'Universal Orlando', 'https://www.universalorlando.com'),
    t('orl-seaworld', 'SeaWorld Orlando', 'https://seaworld.com/orlando/'),
    t('orl-gatorland', 'Gatorland', 'https://www.gatorland.com'),
    t('orl-ksc', 'Kennedy Space Center', 'https://www.kennedyspacecenter.com'),
    t('orl-funspot', 'Fun Spot', 'https://fun-spot.com'),
    t('orl-medievaltimes', 'Medieval Times', 'https://www.medievaltimes.com/orlando'),
    t('orl-footgolf', "FootGolf at Disney's Oak Trail", 'https://www.footgolforlando.com'),
    t('orl-orlandoeye', 'The Orlando Eye', 'https://www.icondrivenorlando.com'),
    t('orl-bluemangroup', 'Blue Man Group', 'https://www.blueman.com/orlando'),
    t('orl-icebar', 'ICEBAR Orlando', 'https://icebarorlando.com'),
    div('orl-div-minigolf', 'Mini Golf'),
    t('orl-mg-fantasia', "Disney's Fantasia Gardens & Fairways", 'https://disneyworld.disney.go.com/recreation/fantasia-gardens-miniature-golf/'),
    t('orl-mg-wintersummerland', "Disney's Winter Summerland", 'https://disneyworld.disney.go.com/recreation/winter-summerland-miniature-golf/'),
    t('orl-mg-hollywooddrivein', "Universal's Hollywood Drive-In Golf", 'https://www.universalorlando.com/web/en/us/things-to-do/mini-golf'),
    t('orl-mg-congoriver', 'Congo River Golf', 'https://www.congoriver.com'),
    t('orl-mg-piratescove', "Pirate's Cove Adventure Golf", 'https://piratescove.net'),
    t('orl-mg-hawaiianrumble', 'Hawaiian Rumble Adventure Golf', 'https://www.hawaiianrumbleorlando.com'),
    t('orl-mg-puttingedge', 'Putting Edge', 'https://www.puttingedge.com'),
    t('orl-mg-gatorgolf', 'Gator Golf Adventure Park', 'https://gatorgolfadventurepark.com'),
    t('orl-mg-mightyjungle', 'Mighty Jungle Golf Adventure', 'https://mightyjunglegolf.com'),
    t('orl-mg-cranes', "Crane's Adventure Mini Golf", 'https://cranesadventuregolf.com'),
    t('orl-mg-ripleys', "Ripley's Crazy Golf", 'https://www.ripleysorlando.com/crazy-golf/'),
    div('orl-div-deals', 'Deals & Discount Tickets'),
    t('orl-groupon', 'Groupon', 'https://www.groupon.com'),
    t('orl-gocity', 'Go City', 'https://gocity.com/orlando'),
    t('orl-bestoforlando', 'BestofOrlando.com', 'https://www.bestoforlando.com'),
    t('orl-eatandplay', 'Orlando Eat and Play Card', 'https://www.orlandoeatandplaycard.com'),
    t('orl-magicaldining', 'Magical Dining', 'https://www.visitorlando.com/magical-dining/'),
    t('orl-tripster', 'Tripster', 'https://www.tripster.com'),
    div('orl-div-local', 'Local Info/Listings'),
    t('orl-visitorlando', 'Visit Orlando', 'https://www.visitorlando.com'),
    t('orl-orlandoweekly', 'Orlando Weekly', 'https://www.orlandoweekly.com'),
    t('orl-timeout', 'Time Out', 'https://www.timeout.com/orlando'),
    t('orl-allevents', 'AllEvents.in', 'https://allevents.in/orlando'),
  ];
  addCat('orlando-restaurants', 'Restaurants', 'orlando');
  full.tiles['orlando-restaurants'] = [
    div('orlr-div-breakfast', 'Breakfast'),
    t('orlr-firstwatch', 'First Watch', 'https://www.firstwatch.com'),
    tf('orlr-rokkas', "Rokka's", 'https://www.rokkasmarket.com'),
    tf('orlr-amorempedacos', 'Amor em Pedaços Bakery', 'https://www.amorempedacosbakery.com'),
    tf('orlr-eskina', 'Eskina', 'https://www.eskinaorlando.com'),
    tf('orlr-sodiedoces', 'Sodie Doces', 'https://www.sodiedoces.com'),
    tf('orlr-seabra', 'Seabra Supermarket', 'https://www.seabrafoods.com'),
    div('orlr-div-coffee', 'Coffee Shops'),
    t('orlr-stardust', 'Stardust Video and Coffee', 'https://www.stardustvideoandcoffee.com'),
    t('orlr-mecatos', 'Mecatos Bakery & Café', 'https://www.mecatosbakery.com'),
    t('orlr-lecafedeparis', 'Le Café de Paris', 'https://lecafedeparis.us'),
    t('orlr-holygrain', 'Holy Grain Coffee Shop', 'https://www.holygraincoffeeshop.com'),
    t('orlr-achilles', 'Achilles Art Café', 'https://www.achillesartcafe.com'),
    div('orlr-div-dinner', 'Dinner'),
    t('orlr-hawkers', 'Hawkers Asian Street Food', 'https://eathawkers.com'),
    t('orlr-tacosdonandres', 'Tacos Don Andres', 'https://www.tacosdonandres.com'),
    t('orlr-sixtyvines', 'Sixty Vines', 'https://sixtyvines.com'),
    t('orlr-thewhiskey', 'The Whiskey', 'https://thewhiskeyorlando.com'),
    t('orlr-teak', 'Teak Neighborhood Grill', 'https://www.teakorlando.com'),
    t('orlr-miasitalian', "Mia's Italian Kitchen", 'https://miasitaliankitchen.com'),
    t('orlr-domu', 'DOMU', 'https://domu-orlando.com'),
    t('orlr-voodoobayou', 'Voodoo Bayou', 'https://www.voodoobayou.com'),
    t('orlr-eddievs', "Eddie V's Prime Seafood", 'https://www.eddiev.com'),
    t('orlr-oceanprime', 'Ocean Prime', 'https://www.ocean-prime.com'),
    t('orlr-christinis', 'Christinis Ristorante Italiano', 'https://christinis.com'),
    t('orlr-thehorlando', 'The H Orlando', 'https://thehorlando.com'),
    t('orlr-mortons', "Morton's The Steakhouse", 'https://www.mortons.com'),
    t('orlr-bocasgrill', 'Bocas Grill', 'https://bocasgrill.com'),
    t('orlr-coopershawk', "Cooper's Hawk", 'https://www.coopershawkwinery.com'),
    t('orlr-roccostacos', "Rocco's Tacos", 'https://roccostacos.com'),
    tf('orlr-kingspoint', "King's Point Ice Cream & Burger", 'https://www.kingspointicecream.com'),
    t('orlr-lagranja', 'La Granja', 'https://lagranjarestaurants.com'),
    tf('orlr-14bis', '14 Bis Pizzeria', 'https://www.14bispizzeria.com'),
    t('orlr-piefection', 'Pie-Fection Pizzeria & Bistro', 'https://www.piefectionpizzeria.com'),
    t('orlr-yardhouse', 'Yard House', 'https://www.yardhouse.com'),
    t('orlr-olered', 'Ole Red Orlando', 'https://www.olered.com/orlando'),
    t('orlr-bluemartini', 'Blue Martini', 'https://bluemartinilounge.com'),
    div('orlr-div-steakhouse', 'Brazilian Steakhouses'),
    tf('orlr-fogodechao', 'Fogo de Chão', 'https://fogodechao.com'),
    tf('orlr-texasdebrazil', 'Texas de Brazil', 'https://texasdebrazil.com'),
    tf('orlr-boibrazil', 'Boi Brazil Churrascaria', 'https://boibrazilorlando.com'),
    tf('orlr-cafemineiro', 'Café Mineiro Brazilian Steakhouse', 'https://cafemineiro.com'),
    div('orlr-div-rooftop', 'Rooftop'),
    t('orlr-californiagrill', 'California Grill', 'https://disneyworld.disney.go.com/dining/contemporary-resort/california-grill/'),
    t('orlr-capa', 'Capa', 'https://www.fourseasons.com/orlando/dining/restaurants/capa/'),
    t('orlr-stksteakhouse', 'STK Steakhouse', 'https://stksteakhouse.com/location/stk-orlando/'),
    t('orlr-toledo', 'Toledo', 'https://www.hyatt.com/en-US/hotel/florida/grand-bohemian-hotel-orlando/mcoga/dining'),
    t('orlr-bullagastrobar', 'Bulla Gastrobar', 'https://bullagastrobar.com'),
    t('orlr-illume', 'illume', 'https://illumeorlando.com'),
    t('orlr-paddlefish', 'Paddlefish', 'https://www.paddlefishrestaurant.com'),
    t('orlr-acskybar', 'AC Sky Bar', 'https://acskybarorlando.com'),
    t('orlr-bar17bistro', 'Bar 17 Bistro', 'https://www.bar17bistro.com'),
    t('orlr-aerorooftop', 'Aero Rooftop Bar', 'https://www.hilton.com/en/hotels/mcoaehh-hilton-orlando-buena-vista-palace/dining/'),
    t('orlr-kalarooftop', 'KaLa Rooftop', 'https://kalaorlando.com'),
    t('orlr-tomswatchbar', "Tom's Watch Bar", 'https://tomswatchbar.com/orlando/'),
    t('orlr-hightide', 'High Tide', 'https://www.marriott.com/en-us/hotels/mcogb-renaissance-orlando-at-seaworld/dining/'),
    t('orlr-altira', 'Altira Pool + Lounge', 'https://www.hyatt.com/en-US/hotel/florida/grand-bohemian-hotel-orlando/mcoga/dining/altira'),
    t('orlr-hansonsshoerepair', "Hanson's Shoe Repair", 'https://hansonsshoerepair.com'),
    t('orlr-wholeenchilada', 'The Whole Enchilada', 'https://thewholeenchiladaorlando.com'),
  ];
  addCat('orlando-speakeasies', 'Speakeasies/Hidden Bars', 'orlando');
  full.tiles['orlando-speakeasies'] = [
    tb('spk-hansons', "Hanson's Shoe Repair", 'https://hansonsshoerepair.com', 'Call (407) 476-9446 on the day of your visit for the password.'),
    tb('spk-mathers', 'Mathers Social Gathering', 'https://mathersorlando.com', 'A dapper doorman at ground floor (Phoenix Building, Magnolia Ave) checks you in, then take the elevator to the library floor and find the correct bookcase to open the hidden door.'),
    tb('spk-vault5421', 'Vault 5421', 'https://www.vault5421.com', 'Walk through Gods & Monsters comic shop (I-Drive) to the back, look for the vault-style door — no password needed.'),
    tb('spk-courtesybar', 'The Courtesy Bar', 'https://www.thecourtesybar.com', 'No secret entry required, just visit their Winter Park location directly.'),
    tb('spk-permanentvacation', 'Permanent Vacation', 'https://www.permanentvacationbar.com', 'Inside Copper Rocket Pub (Maitland); find the door on the far right marked "Employees Only" and push through.'),
    tb('spk-enzoshideaway', "Enzo's Hideaway & Tunnel Bar", 'https://www.enzoshideawayorlando.com', 'Enter through the marked tunnel entrance at Disney Springs.'),
    tb('spk-crownalley', 'Crown Alley', 'https://www.crownalleyorlando.com', 'Hidden beside The Grafton Street Pub (Lake Mary); look for the red phone booth entrance.'),
    tb('spk-parksocial', 'Park Social', 'https://parksocialorlando.com', 'Call (407) 636-7020 for the nightly password, then whisper it into the rotary phone mounted outside the building to gain entry.'),
  ];

  // ---- Groveland / Clermont ----
  addCat('groveland', 'Groveland / Clermont', null);
  full.tiles.groveland = [
    div('grv-div-attractions', 'Attractions'),
    t('grv-citrustower', 'Florida Citrus Tower', 'https://www.floridacitrustower.com'),
    t('grv-lakeminneola', 'Lake Minneola / Clermont Waterfront Park', 'https://www.clermontfl.gov/facilities/facility/details/waterfront-park-6'),
    t('grv-downtownclermont', 'Historic Downtown Clermont', 'https://www.clermontfl.gov'),
    t('grv-howeymansion', 'The Howey Mansion', 'https://thehoweymansion.com'),
    t('grv-lunasea', 'LunaSea Alpaca Farm', 'https://www.lunaseaalpacafarm.com'),
    t('grv-susieq', "Susie Q's Blueberry Farm", 'https://www.facebook.com/SusieQsBlueberryFarm/'),
    t('grv-presidentshalloffame', 'Presidents Hall of Fame', 'https://www.presidentshalloffame.com'),
    t('grv-southernhill', 'Southern Hill Farms', 'https://www.southernhillfarms.com'),
  ];
  addCat('groveland-restaurants', 'Restaurants', 'groveland');
  full.tiles['groveland-restaurants'] = [
    div('grvr-div-breakfast', 'Breakfast'),
    t('grvr-rootbranch', 'Root & Branch Bistro + Bar', 'https://www.rootandbranchbistro.com'),
    t('grvr-maryskountry', "Mary's Kountry Kitchen", 'https://www.maryskountrykitchen.com'),
    t('grvr-maplestreet', 'Maple Street Biscuit Company', 'https://www.maplestreetbiscuits.com'),
    t('grvr-cheeserspalace', "Cheeser's Palace Cafe", 'https://www.cheeserspalacecafe.com'),
    t('grvr-kekes', "Keke's Breakfast Cafe", 'https://kekescafe.com'),
    t('grvr-anotherbrokenegg', 'Another Broken Egg Cafe', 'https://anotherbrokenegg.com'),
    div('grvr-div-coffee', 'Coffee Shops'),
    t('grvr-justlove', 'Just Love Coffee Cafe', 'https://justlovecoffeecafe.com'),
    t('grvr-foxtail', 'Foxtail Coffee', 'https://foxtailcoffee.co'),
    t('grvr-lecafedeparis', 'Le Café de Paris', 'https://lecafedeparis.us'),
    t('grvr-blackrabbit', 'The Black Rabbit', 'https://theblackrabbitclermont.com'),
    t('grvr-sevenmade', 'SevenMade', 'https://sevenmade.com'),
    t('grvr-flagcoffee', 'Flag Coffee Corner', 'https://flagcoffeecorner.com'),
    t('grvr-reggaecafe', 'Reggae Café', 'https://reggaecafeclermont.com'),
    t('grvr-filigree', 'Filigree Coffee', 'https://filigreecoffee.com'),
    t('grvr-citruscoffee', 'Citrus Coffee', 'https://citruscoffeeco.com'),
    t('grvr-minchcoffee', 'Minch Coffee', 'https://minchcoffee.com'),
    t('grvr-starbucks', 'Starbucks', 'https://www.starbucks.com'),
    t('grvr-christmascafe', 'Christmas Café', 'https://christmascafeclermont.com'),
    t('grvr-sweeties', 'Sweeties Café and Tea House', 'https://sweetiescafeandteahouse.com'),
    div('grvr-div-dinner', 'Dinner'),
    t('grvr-butcherblock', 'The Butcher Block Kitchen', 'https://thebutcherblockkitchen.com'),
    t('grvr-craftedsteakhouse', 'Crafted Steakhouse', 'https://craftedsteakhouse.com'),
    t('grvr-rootbranch2', 'Root & Branch Bistro + Bar', 'https://www.rootandbranchbistro.com'),
    t('grvr-crookedspoon', 'The Crooked Spoon Gastropub', 'https://thecrookedspoon.com'),
    t('grvr-redwing', 'Red Wing Restaurant', 'https://redwingrestaurant.com'),
    t('grvr-mitierra', 'Mi Tierra Mexican Food', 'https://mitierraclermont.com'),
    t('grvr-coyoterojo', 'Coyote Rojo', 'https://coyoterojomexicangrill.com'),
    t('grvr-saltshack', 'Salt Shack', 'https://saltshackoasis.com'),
    t('grvr-bullsmokehouse', 'Bull Smokehouse', 'https://bullsmokehouse.com'),
    t('grvr-ikaho', 'Ikaho Sushi Japanese Restaurant', 'https://ikahosushi.com'),
    t('grvr-clermontfishhouse', 'Clermont Fish House', 'https://clermontfishhouse.com'),
    t('grvr-huarike', 'Huarike Peruvian Cuisine', 'https://huarike.com'),
    t('grvr-thestation', 'The Station', 'https://thestationclermont.com'),
    tf('grvr-leosbarbecue', "Leo's Barbecue", 'https://leosbarbecue.com'),
  ];
  addCat('groveland-events', 'Events', 'groveland');
  full.tiles['groveland-events'] = [
    t('grve-clermontmainst', 'Clermont Main Street Event Calendar', 'https://www.clermontmainstreet.com/events'),
    t('grve-clermontfarmersmarket', 'Downtown Clermont Farmers Market', 'https://www.clermontfl.gov/farmersmarket'),
    t('grve-grovelandfarmersmarket', 'Groveland Farmers Market/Community Market', 'https://www.groveland-fl.gov'),
    t('grve-myfamily', 'MyCentralFloridaFamily.com', 'https://mycentralfloridafamily.com'),
  ];
  full.categories['groveland-deals'] = { name: 'Deals & Discounts', parentId: 'groveland', order: (order['groveland'] || 0), stripeColor: null };
  order['groveland'] = (order['groveland'] || 0) + 1;
  full.tiles['groveland-deals'] = [];
  addCat('groveland-local', 'Local Info/Listings', 'groveland');
  full.tiles['groveland-local'] = [
    t('grvl-cityofclermont', 'City of Clermont', 'https://www.clermontfl.gov'),
    t('grvl-cityofgroveland', 'City of Groveland', 'https://www.groveland-fl.gov'),
    t('grvl-clermontmainstreet', 'Clermont Main Street', 'https://www.clermontmainstreet.com'),
    t('grvl-southlakechamber', 'South Lake Chamber of Commerce', 'https://www.southlakechamber-fl.com'),
    t('grvl-hoa', 'HOA', 'https://www.southwestpropertymanagement.com'),
    t('grvl-dukeenergy', 'Duke Energy Florida', 'https://www.duke-energy.com/home/billing/florida'),
  ];

  // ---- Travel ----
  addCat('travel', 'Travel', null);
  full.tiles.travel = [
    div('trv-div-booking', 'Booking Sites'),
    t('trv-booking', 'Booking.com', 'https://www.booking.com'),
    t('trv-kayak', 'Kayak', 'https://www.kayak.com'),
    t('trv-hotelscom', 'Hotels.com', 'https://www.hotels.com'),
    t('trv-priceline', 'Priceline', 'https://www.priceline.com'),
    t('trv-expedia', 'Expedia', 'https://www.expedia.com'),
    t('trv-tripadvisor', 'TripAdvisor', 'https://www.tripadvisor.com'),
    t('trv-travelocity', 'Travelocity', 'https://www.travelocity.com'),
    t('trv-costcotravel', 'Costco Travel', 'https://www.costcotravel.com'),
    t('trv-vacationstogo', 'Vacations To Go', 'https://www.vacationstogo.com'),
    div('trv-div-flights', 'Flights/Airlines'),
    t('trv-flightaware', 'FlightAware', 'https://flightaware.com'),
    t('trv-southwest', 'Southwest', 'https://www.southwest.com'),
    t('trv-delta', 'Delta', 'https://www.delta.com'),
    t('trv-united', 'United', 'https://www.united.com'),
    t('trv-american', 'American Airlines', 'https://www.aa.com'),
    t('trv-jetblue', 'JetBlue', 'https://www.jetblue.com'),
    div('trv-div-hotels', 'Hotels/Lodging'),
    t('trv-vrbo', 'VRBO', 'https://www.vrbo.com'),
    t('trv-airbnb', 'Airbnb', 'https://www.airbnb.com'),
    t('trv-ihg', 'IHG', 'https://www.ihg.com'),
    t('trv-marriott', 'Marriott', 'https://www.marriott.com'),
    t('trv-wyndham', 'Wyndham', 'https://www.wyndhamhotels.com'),
    t('trv-hilton', 'Hilton', 'https://www.hilton.com'),
    t('trv-bestwestern', 'Best Western', 'https://www.bestwestern.com'),
    div('trv-div-cruises', 'Cruises'),
    t('trv-cruisecritic', 'CruiseCritic', 'https://www.cruisecritic.com'),
    t('trv-carnival', 'Carnival', 'https://www.carnival.com'),
    t('trv-royalcaribbean', 'Royal Caribbean', 'https://www.royalcaribbean.com'),
    t('trv-msccruises', 'MSC Cruises', 'https://www.msccruisesusa.com'),
    t('trv-norwegian', 'Norwegian Cruise Line', 'https://www.ncl.com'),
    t('trv-disneycruise', 'Disney Cruise Line', 'https://disneycruise.disney.go.com'),
    div('trv-div-trains', 'Trains'),
    t('trv-amtrak', 'Amtrak', 'https://www.amtrak.com'),
    t('trv-sunrail', 'SunRail', 'https://www.sunrail.com'),
    t('trv-brightline', 'Brightline', 'https://www.gobrightline.com'),
  ];
  addCat('travel-daytrips', 'Day Trips', 'travel');
  full.tiles['travel-daytrips'] = [
    div('dt-div-space', 'Space/Attractions'),
    t('dt-ksc', 'Kennedy Space Center', 'https://www.kennedyspacecenter.com'),
    t('dt-legoland', 'LEGOLAND', 'https://www.legoland.com/florida/'),
    t('dt-buschgardens', 'Busch Gardens', 'https://www.buschgardens.com/tampa/'),
    t('dt-boktower', 'Bok Tower Gardens', 'https://boktowergardens.org'),
    div('dt-div-beaches', 'Beaches'),
    t('dt-cocoabeach', 'Cocoa Beach', 'https://www.visitcocoabeach.com'),
    t('dt-newsmyrna', 'New Smyrna Beach', 'https://www.visitnsbfl.com'),
    t('dt-daytonabeach', 'Daytona Beach', 'https://www.daytonabeach.com'),
    t('dt-canaveral', 'Canaveral National Seashore', 'https://www.nps.gov/cana/'),
    t('dt-clearwaterbeach', 'Clearwater Beach', 'https://www.visitstpeteclearwater.com'),
    t('dt-stpetebeach', 'St. Pete Beach', 'https://www.visitstpeteclearwater.com'),
    t('dt-staugustinebeach', 'St. Augustine Beach', 'https://www.staugustinebeachfl.gov'),
    div('dt-div-springs', 'Springs'),
    t('dt-devilsden', "Devil's Den", 'https://www.devilsden.com'),
    t('dt-bluespring', 'Blue Spring State Park', 'https://www.floridastateparks.org/BlueSpring'),
    t('dt-rockspringskelly', 'Rock Springs / Kelly Park', 'https://www.orangecountyfl.net/CultureParks/Parks.aspx'),
    t('dt-wekiwasprings', 'Wekiwa Springs State Park', 'https://www.floridastateparks.org/WekiwaSprings'),
    t('dt-silverglen', 'Silver Glen Springs', 'https://www.fs.usda.gov/recarea/ocala/recarea/?recid=31681'),
    t('dt-gilchristblue', 'Gilchrist Blue Springs', 'https://www.floridastateparks.org/GilchristBlueSprings'),
    div('dt-div-towns', 'Historic/Charming Towns'),
    t('dt-staugustine', 'St. Augustine', 'https://www.visitstaugustine.com'),
    t('dt-tarponsprings', 'Tarpon Springs', 'https://www.ctarponsprings.com'),
    div('dt-div-farmszoos', 'Farms/Zoos'),
    t('dt-southernhill', 'Southern Hill Farms', 'https://www.southernhillfarms.com'),
    t('dt-amberbrooke', 'Amber Brooke Farms', 'https://amberbrookefarms.com'),
    t('dt-cfzoo', 'Central Florida Zoo & Botanical Gardens', 'https://www.centralfloridazoo.org'),
    t('dt-hunsader', 'Hunsader Farms', 'https://hunsaderfarms.com'),
    t('dt-brevardzoo', 'Brevard Zoo', 'https://brevardzoo.org'),
    t('dt-zootampa', 'ZooTampa', 'https://zootampa.org'),
    t('dt-wildflorida', 'Wild Florida', 'https://www.wildfloridairboats.com'),
    div('dt-div-segway', 'Segway Tours'),
    t('dt-segwaycfl', 'Segway Of Central Florida', 'https://www.segwayofcentralflorida.com'),
    t('dt-glideadventure', 'Glide Adventure Segway Tours', 'https://www.glideadventuretours.com'),
    t('dt-offroadsegway', 'Off-Road Segway Tours', 'https://www.offroadsegwaytours.com'),
    t('dt-stjohnsrivercruises', "St. John's River Cruises", 'https://www.sjrivercruises.com'),
    t('dt-sunshinestatetours', 'Sunshine State Tours', 'https://www.sunshinestatetours.com'),
    t('dt-wildernessbacktrail', 'Wilderness Back Trail Adventure', 'https://disneyworld.disney.go.com/recreation/wilderness-back-trail-adventure/'),
  ];
  addCat('travel-intl', 'International', 'travel');
  full.tiles['travel-intl'] = [
    div('intl-div-booking', 'Deals/Booking'),
    t('intl-googleflights', 'Google Flights', 'https://www.google.com/travel/flights'),
    t('intl-skyscanner', 'Skyscanner', 'https://www.skyscanner.com'),
    t('intl-momondo', 'Momondo', 'https://www.momondo.com'),
    t('intl-going', 'Going', 'https://www.going.com'),
    div('intl-div-visa', 'Country/Visa Info'),
    tb('intl-statedept', 'U.S. State Dept Travel Advisories', 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html', 'Safety/political risk level for a country (crime, unrest, natural disasters) — check this for "is it safe to go."'),
    tb('intl-iata', 'IATA Travel Centre', 'https://www.iatatravelcentre.com', 'Entry/visa/passport requirements for a specific destination — check this for "what documents do I need to get in."'),
    div('intl-div-itineraries', 'Itineraries/Trip Planning'),
    t('intl-lonelyplanet', 'Lonely Planet', 'https://www.lonelyplanet.com'),
    t('intl-ricksteves', 'Rick Steves', 'https://www.ricksteves.com'),
    t('intl-wanderlog', 'Wanderlog', 'https://wanderlog.com'),
    div('intl-div-currency', 'Currency/Practical'),
    t('intl-xe', 'XE Currency Converter', 'https://www.xe.com'),
    div('intl-div-brazil', 'Brazil'),
    t('intl-latam', 'LATAM Airlines', 'https://www.latamairlines.com'),
    tf('intl-azul', 'Azul', 'https://www.voeazul.com.br'),
    tf('intl-gol', 'GOL', 'https://www.voegol.com.br'),
    t('intl-copa', 'Copa Airlines', 'https://www.copaair.com'),
    t('intl-delta2', 'Delta', 'https://www.delta.com'),
    t('intl-united2', 'United', 'https://www.united.com'),
    t('intl-flightsfrom', 'FlightsFrom.com', 'https://www.flightsfrom.com'),
  ];

  // ---- Lite pack: "Junk Drawer" category, one empty subcategory, 6 tiles total. Home starts
  // empty too (ready for its own "+" tile) so the whole first-run experience is genuinely just
  // these 6 tiles, matching "just have a core of like six tiles to start."
  var lite = { categories: {}, tiles: {} };
  lite.tiles.home = [];
  lite.categories['junk-drawer'] = { name: 'Junk Drawer', parentId: null, order: 0, stripeColor: null };
  lite.categories['junk-drawer-sub'] = { name: 'The Drawer Within The Drawer', parentId: 'junk-drawer', order: 0, stripeColor: null };
  lite.tiles['junk-drawer'] = [
    t('jd-microsoft', 'Microsoft', 'https://www.microsoft.com'),
    t('jd-anthropic', 'Anthropic', 'https://www.anthropic.com'),
    t('jd-walmart', 'Walmart', 'https://www.walmart.com'),
    t('jd-lucasfilm', 'Lucasfilm', 'https://www.lucasfilm.com'),
    t('jd-googlepixel', 'Google Pixel Store', 'https://store.google.com/category/phones'),
    t('jd-adarkroom', 'A Dark Room', 'https://adarkroom.doublespeakgames.com'),
  ];
  lite.tiles['junk-drawer-sub'] = [];

  window.STARTER_CONTENT = { full: full, lite: lite };
})();
