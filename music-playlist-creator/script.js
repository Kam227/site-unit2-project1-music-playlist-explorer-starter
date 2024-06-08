const enableModal = document.getElementsByClassName('playlist-cards');
const disableModal = document.getElementById('close');
const modalOverlay = document.getElementById('modal');
const playlistImgModal = document.getElementById('playlist-img-modal');
const playlistTitleModal = document.getElementById('playlist-title-modal');
const creatorNameModal = document.getElementById('creator-name-modal');
const modalSongs = document.getElementById('modal-songs');
const playlistShuffle = document.getElementById('playlist-shuffle');
const featuredPlaylistSongs = document.getElementById('featured-playlist-songs');
const newPlaylist = document.getElementById('new-playlist');
const closeNameChange = document.getElementById('close-name-change');
const newNameInput = document.getElementById('new-playlist-name');
const submitNameChange = document.getElementById('submit-name-change');

let currentPlaylist;
let currentCard;
let playlists = data.playlists;

/* Populating Playlist Cards */
document.addEventListener('DOMContentLoaded', () => {
  const playlistContainer = document.querySelector('.playlist-rows');

  function createPlaylistCard(playlist, index) {
    const card = document.createElement('button');
    card.id = 'playlist-cards';
    card.classList.add('playlist-cards');

    card.innerHTML = `
      <div>
        <img class="playlist-img" src="${playlist.playlist_art}" alt="${playlist.playlist_name}">
        <p class="playlist-title-main">${playlist.playlist_name}</p>
        <p class="creator-name-main">By ${playlist.playlist_creator}</p>
        <div class="playlist-bottom-section">
          <div class="like">
            <p class="heart-img">🤍</p>
            <p class="like-count">${playlist.likeCount}</p>
          </div>
          <p id="playlist-delete-${index}" class="playlist-delete">🗑️</p>
        </div>
      </div>
    `;

    const heart = card.querySelector('.heart-img');
    const likeCount = card.querySelector('.like-count');
    const playlistImg = card.querySelector('.playlist-img');
    const playlistTitle = card.querySelector('.playlist-title-main');
    const del = card.querySelector(`#playlist-delete-${index}`);

    del.addEventListener('click', function () {
      deletePlaylist(index);
    });

    heart.addEventListener('click', function() {
      if (heart.textContent === '🤍') {
        heart.textContent = '🖤';
        likeCount.textContent = Number(likeCount.textContent) + 1;
      } else if (heart.textContent === '🖤') {
        heart.textContent = '🤍';
        likeCount.textContent = Number(likeCount.textContent) - 1;
      }
    });

    /* NOTE: YOU MUST CLICK THE CARD IMAGE OR CARD NAME TO OPEN THE MODAL */
    /* THIS WAS DONE TO PREVENT THE CARD MODAL FROM OPENING WHEN LIKING */

    playlistImg.addEventListener('click', function() {
      modalOn(playlist, card);
    });

    playlistTitle.addEventListener('click', function() {
      modalOn(playlist, card);
    });

    card.addEventListener('mouseover', function() {
      on(card);
    });

    card.addEventListener('mouseout', function() {
      off(card);
    });

    function on(card) {
      card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    }

    function off(card) {
      card.style.boxShadow = "none";
    }

    return card;
  }

  function renderPlaylists(playlists) {
    playlistContainer.innerHTML = '';
    for (let i = 0; i < playlists.length; i++) {
      const card = createPlaylistCard(playlists[i], i);
      playlistContainer.appendChild(card);
    }
  }

  function deletePlaylist(index) {
    playlists.splice(index, 1);
    renderPlaylists(playlists);
  }

  renderPlaylists(playlists);

/* Populating Modal */
  function modalOn(playlist, card) {
    currentPlaylist = playlist;
    currentCard = card;
    playlistImgModal.src = playlist.playlist_art;
    playlistTitleModal.textContent = playlist.playlist_name;
    creatorNameModal.textContent = playlist.playlist_creator;
    modalSongs.innerHTML = '';

    playlist.songs.forEach(song => {
      const songContainer = document.createElement('div');
      songContainer.classList.add('modal-song-container');

      songContainer.innerHTML = `
          <img class="playlist-img-song" src="${song.cover_art}" alt="${song.title}">
          <div class="modal-song-content">
              <div>
                  <p class="song-title">${song.title}</p>
                  <p class="artist-name">${song.artist}</p>
                  <p class="album-name">${song.album}</p>
              </div>
              <div class="modal-song-duration">
                  <p>${song.duration}</p>
              </div>
          </div>
      `;
      modalSongs.appendChild(songContainer);
    });

    document.getElementById('modal').style.display = 'flex';

/* Shuffling Playlist */
    function shuffle() {
      for(let i = 0; i < playlist.songs.length; i++) {
        let index = Math.floor(Math.random() * 4);
        let swap;

        swap = playlist.songs[index];
        playlist.songs[index] = playlist.songs[i];
        playlist.songs[i] = swap;
      }

      modalSongs.innerHTML = '';
      playlist.songs.forEach(song => {
        const songContainer = document.createElement('div');
        songContainer.classList.add('modal-song-container');

        songContainer.innerHTML = `
            <img class="playlist-img-song" src="${song.cover_art}" alt="${song.title}">
            <div class="modal-song-content">
                <div>
                    <p class="song-title">${song.title}</p>
                    <p class="artist-name">${song.artist}</p>
                    <p class="album-name">${song.album}</p>
                </div>
                <div>
                    <p>${song.duration}</p>
                </div>
            </div>
        `;
        modalSongs.appendChild(songContainer);
      });
    }

    playlistShuffle.addEventListener('click', shuffle);
  }

  function modalOff() {
    document.getElementById('modal').style.display = 'none';
  }

/* Name Change */
  function nameChange() {
    document.getElementById('name-change').style.display = 'flex';
    document.getElementById('modal').style.display = 'none';
    newNameInput.value = currentPlaylist.playlist_name;
  }

  function nameUnchanged() {
    document.getElementById('name-change').style.display = 'none';
  }

  function changePlaylistName() {
    const newName = newNameInput.value;
    currentPlaylist.playlist_name = newName;
    playlistTitleModal.textContent = newName;

    const titleMain = currentCard.querySelector('.playlist-title-main');
    titleMain.textContent = newName;

    nameUnchanged();
    modalOn(currentPlaylist, currentCard);
  }

  disableModal.addEventListener('click', modalOff);

  modalOverlay.addEventListener('click', function(event) {
    if (event.target === modalOverlay) {
      modalOff();
    }
  });

  playlistTitleModal.addEventListener('click', nameChange);
  closeNameChange.addEventListener('click', nameUnchanged);
  submitNameChange.addEventListener('click', changePlaylistName);
});

/* Featured Page */
document.addEventListener('DOMContentLoaded', () => {
  const featuredPlaylistContainer = document.getElementById('featured-playlist');
  const featuredPlaylistSongsContainer = document.getElementById('featured-playlist-songs');

  function feature(playlist) {
    const playlistDetails = document.createElement('div');
    playlistDetails.classList.add('featured-playlist-section');

    playlistDetails.innerHTML = `
      <img class="featured-playlist-img" src="${playlist.playlist_art}" />
      <p>${playlist.playlist_name}</p>
      <p>${playlist.playlist_creator}</p>
    `;

    playlist.songs.forEach(song => {
      const songContainer = document.createElement('div');
      songContainer.classList.add('featured-songs');

      songContainer.innerHTML = `
        <div class="featured-song-section">
            <img class="featured-song-img" src="${song.cover_art}" />
            <div>
                <p>${song.title}</p>
                <p>${song.album}</p>
                <p>${song.duration}</p>
            </div>
        </div>
      `;
      featuredPlaylistSongsContainer.appendChild(songContainer);
    });

    featuredPlaylistContainer.appendChild(playlistDetails);
  }

  function displayFeature(playlists) {
      let index = Math.floor(Math.random() * 8);
      feature(playlists[index]);
  }

  displayFeature(data.playlists);
});
