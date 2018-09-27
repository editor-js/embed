const {expect} = require('chai');

const EmbedTool = require('../src/index');

EmbedTool.prepare({});
const {patternHandler, patterns} = EmbedTool.onPaste;

describe('Services Regexps', () => {

  it('YouTube', async () => {
    const service = 'youtube';

    const url1 = 'https://www.youtube.com/watch?v=wZZ7oFKsKzY';
    const url2 = 'https://www.youtube.com/watch?v=ZWO6TQHw7is';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://www.youtube.com/embed/wZZ7oFKsKzY');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://www.youtube.com/embed/ZWO6TQHw7is');
    expect(data2.source).to.be.equal(url2);
  });

  it('Vimeo', async () => {
    const service = 'vimeo';

    const url1 = 'https://vimeo.com/289836809';
    const url2 = 'https://vimeo.com/280712228';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://player.vimeo.com/video/289836809?title=0&byline=0');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://player.vimeo.com/video/280712228?title=0&byline=0');
    expect(data2.source).to.be.equal(url2);
  });

  it('Coub', async () => {
    const service = 'coub';

    const url1 = 'https://coub.com/view/1efrxs';
    const url2 = 'https://coub.com/view/1c6nrr';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://coub.com/embed/1efrxs');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://coub.com/embed/1c6nrr');
    expect(data2.source).to.be.equal(url2);
  });

  it('Imgur', async () => {
    const service = 'imgur';

    const url1 = 'https://imgur.com/gallery/OHbkxgr';
    const url2 = 'https://imgur.com/gallery/TqIWG12';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('http://imgur.com/OHbkxgr/embed');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('http://imgur.com/TqIWG12/embed');
    expect(data2.source).to.be.equal(url2);
  });

  it('Gfycat', async () => {
    const service = 'gfycat';

    const url1 = 'https://gfycat.com/EsteemedMarvelousHagfish';
    const url2 = 'https://gfycat.com/OddCornyLeech';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://gfycat.com/ifr/EsteemedMarvelousHagfish');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://gfycat.com/ifr/OddCornyLeech');
    expect(data2.source).to.be.equal(url2);
  });

  it('Twitch channel', async () => {
    const service = 'twitch-channel';

    const url1 = 'https://www.twitch.tv/ninja';
    const url2 = 'https://www.twitch.tv/gohamedia';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://player.twitch.tv/?channel=ninja');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://player.twitch.tv/?channel=gohamedia');
    expect(data2.source).to.be.equal(url2);
  });

  it('Twitch video', async () => {
    const service = 'twitch-video';

    const url1 = 'https://www.twitch.tv/videos/315468440';
    const url2 = 'https://www.twitch.tv/videos/314691366';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://player.twitch.tv/?video=v315468440');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://player.twitch.tv/?video=v314691366');
    expect(data2.source).to.be.equal(url2);
  });

  it('Yandex Music album', async () => {
    const service = 'yandex-music-album';

    const url1 = 'https://music.yandex.ru/album/5643859';
    const url2 = 'https://music.yandex.ru/album/5393158';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://music.yandex.ru/iframe/#album/5643859/');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://music.yandex.ru/iframe/#album/5393158/');
    expect(data2.source).to.be.equal(url2);
  });

  it('Yandex Music track', async () => {
    const service = 'yandex-music-track';

    const url1 = 'https://music.yandex.ru/album/5643859/track/42662275';
    const url2 = 'https://music.yandex.ru/album/5393158/track/41249158';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://music.yandex.ru/iframe/#track/5643859/42662275/');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://music.yandex.ru/iframe/#track/5393158/41249158/');
    expect(data2.source).to.be.equal(url2);
  });

  it('Yandex Music playlist', async () => {
    const service = 'yandex-music-playlist';

    const url1 = 'https://music.yandex.ru/users/yamusic-personal/playlists/25098905';
    const url2 = 'https://music.yandex.ru/users/yamusic-personal/playlists/27924603';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://music.yandex.ru/iframe/#playlist/yamusic-personal/25098905/show/cover/description/');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://music.yandex.ru/iframe/#playlist/yamusic-personal/27924603/show/cover/description/');
    expect(data2.source).to.be.equal(url2);
  });

  it('Codepen', async () => {
    const service = 'codepen';

    const url1 = 'https://codepen.io/Rikkokiri/pen/RYBrwG';
    const url2 = 'https://codepen.io/geoffgraham/pen/bxEVEN';

    expect(patterns[service].test(url1)).to.be.true;
    expect(patterns[service].test(url2)).to.be.true;

    const data1 = patternHandler(url1, service);
    const data2 = patternHandler(url2, service);

    expect(data1.service).to.be.equal(service);
    expect(data1.embed).to.be.equal('https://codepen.io/Rikkokiri/embed/RYBrwG?height=300&theme-id=0&default-tab=css,result&embed-version=2');
    expect(data1.source).to.be.equal(url1);

    expect(data2.service).to.be.equal(service);
    expect(data2.embed).to.be.equal('https://codepen.io/geoffgraham/embed/bxEVEN?height=300&theme-id=0&default-tab=css,result&embed-version=2');
    expect(data2.source).to.be.equal(url2);
  });

  it('Patterns', async () => {
    const services = {
      youtube: 'https://www.youtube.com/watch?v=wZZ7oFKsKzY',
      vimeo: 'https://vimeo.com/289836809',
      coub: 'https://coub.com/view/1efrxs',
      imgur: 'https://imgur.com/gallery/OHbkxgr',
      gfycat: 'https://gfycat.com/EsteemedMarvelousHagfish',
      'twitch-channel': 'https://www.twitch.tv/ninja',
      'twitch-video': 'https://www.twitch.tv/videos/315468440',
      'yandex-music-album': 'https://music.yandex.ru/album/5643859',
      'yandex-music-track': 'https://music.yandex.ru/album/5643859/track/42662275',
      'yandex-music-playlist': 'https://music.yandex.ru/users/yamusic-personal/playlists/25098905',
      'codepen': 'https://codepen.io/Rikkokiri/pen/RYBrwG'
    };

    Object
      .entries(services)
      .forEach(([name, url]) => {
        const foundService = Object.entries(patterns).find(([key, pattern]) => {
          return pattern.test(url);
        });

        expect(foundService[0]).to.be.equal(name);
      });
  });

});
