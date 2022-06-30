const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Muộn rồi mà sao còn",
      singer: "Sơn Tùng M-TP",
      path: "https://aredir.nixcdn.com/Believe_Audio19/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3?st=w9AA-eyRI7yD_VYGfvVWeQ&e=1623141624",
      image: "https://pbs.twimg.com/media/Ez5jRyVVgAQN6Kh.jpg",
    },
    {
      name: "Em Hát Ai Nghe",
      singer: "Orange",
      path: "./Music/EmHatAiNghe.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/b/c/9/a/bc9a9feaff8fe7bda8bc67621b8c1312.jpg",
    },
    {
      name: "Phiến Đá Tính Lặng",
      singer: "Thuỳ Chi",
      path: "./Music/PhienLaTinhLang.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/c/7/2/dc72bdd16dd631e4ed8aaec76dd7691b.jpg",
    },
    {
      name: "Chúng Ta Của Hiện Tại",
      singer: "Sơn Tùng",
      path: "./Music/ChungTaCuaHienTai.mp3",
      image: "https://i.scdn.co/image/ab67616d00001e025888c34015bebbf123957f6d",
    },

    {
      name: "Mùa Yêu Đầu",
      singer: "Bảo Trâm, Hoàng Dũng",
      path: "./Music/MuaYeuDau.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/avatars/0/4/04b9f9f4554d70360f5726d800d5b630_1464583964.jpg",
    },

    {
      name: "Hát Cho Em Mỗi Ngày",
      singer: "Eddy Kiên",
      path: "./Music/HatChoEmMoiNgay.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/avatars/f/3/f3ccdd27d2000e3f9255a7e3e2c48800_1464074023.jpg",
    },
    {
      name: "Có Lẽ Anh Chưa Từng",
      singer: "OnlyC, Karik",
      path: "./Music/CoLeAnhChuaTung.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/c/2/2/d/c22de29d498ba69b4624d1e20a778c05.jpg",
    },
    {
      name: "Ai Mang Cô Đơn Đi",
      singer: "KICM, APJ",
      path: "./Music/AiMangCoDonDi.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/0/1/5/1/0151bcc5dc64312a9b6d9d2245aab54c.jpg",
    },
    {
      name: "Dạ Vũ",
      singer: "Tăng Duy Tân",
      path: "./Music/DaVu.mp3",
      image: "https://data.chiasenhac.com/data/cover/145/144854.jpg",
    },
    {
      name: "Tình Về Nơi Đâu ",
      singer: "Thanh Bùi, Tata Young",
      path: "./Music/TinhVeNoiDau.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/covers/3/9/394659692a460258b45a99f1424ea357_1341809990.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
              <div class="thumb" style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>
          `;
    });
    playList.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //Xun ly CD quay, dung
    cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    //Xy ly phong to/thu nho cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0 + "px";
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xu ly khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //Khi song dc Play

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    //Khi song bi pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    //thanh thoi gian
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //tua bai hat
    progress.oninput = function (e) {
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
    };
    //next bai hat
    nextBtn.onclick = function () {
      _this.nextSong();
    };
    //quay lai bai hat
    prevBtn.onclick = function () {
      _this.prevSong();
    };

    //Nut phat random
    randomBtn.onclick = function () {
      if (_this.isRandom) {
        randomBtn.classList.remove("active");
        _this.isRandom = false;
        // _this.setConfig('isRandom', _this.isRandom)
      } else {
        randomBtn.classList.add("active");
        _this.isRandom = true;
        // _this.setConfig('isRandom', _this.isRandom)
      }
    };

    //Tu dong chuyen bai
    audio.onended = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
    };

    //Nut phat lai
    repeatBtn.onclick = function () {
      if (_this.isRepeat) {
        repeatBtn.classList.remove("active");
        _this.isRepeat = false;
        _this.setConfig("isRepeat", _this.isRepeat);
      } else {
        repeatBtn.classList.add("active");
        _this.isRepeat = true;
        _this.setConfig("isRepeat", _this.isRepeat);
      }
    };

    //click bai hat
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.getAttribute("data-index"));
          _this.render();
          _this.loadCurrentSong();
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 200);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    audio.play();
    this.render();
    this.scrollToActiveSong();
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  nextSong: function () {
    if (this.isRandom) {
      this.playRandomSong();
    } else {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
    }
  },

  prevSong: function () {
    if (this.isRandom) {
      this.playRandomSong();
    } else {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong();
    }
  },

  playRandomSong: function () {
    let newIndex;
    let arr = [];
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  repeatSong: function () {},

  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvents();
    //Có audio.play() trong loadCurrentSong() nên khi mở trang sẽ tự động phát nhạc
    this.loadCurrentSong();
    this.render();

    // randomBtn.classList.toggle('active', this.isRandom)
    // repeatBtn.classList.toggle('active', this.isRepeat)
  },
};
app.start();
