;
// Función anónima autoejecutable
// Registro y características de las WPA's
( ( d, w, n, c ) => {
  // Registro del Service Worker
  if ( 'serviceWorker' in n ) {
    w.addEventListener( 'load', () => {
      n.serviceWorker.register( './sw.js' )
        .then( registration => {
          c( registration )
          c(
            'ServiceWorker registrado con éxito',
            registration.scope
          )
        })
        .catch( err => c( `Registro de ServiceWorker fallido`, err) )
    })
  }

  // Si en la ventana existe el objeto Notification y el permiso de las notificaciones es diferente a denegado
  if ( w.Notification && Notification.permission !== 'denied' ) {

    // Solicita un permiso de notificación
    Notification.requestPermission( status => {
      c( status )

      // Cuerpo de la notificación
      let n = new Notification( 'Título', {
        body: 'Soy una notificación :v',
        icon: './img/icon_192x192.png'
      })
    })
  }

  // Activar sincronización de fondo
  if ( 'serviceWorker' in n && 'SyncManager' in w ) {
    function registerBGSync () {
      n.serviceWorker.ready

        // En cuanto este listo, retorna el registro
        .then( registration => {
          return registration.sync.register( 'github' )
            .then( () => c( 'Sincronización de fondo registrada' ) )
            .catch( () => c( 'Fallo de sincronización de fondo', err ) )
        })
    }

    registerBGSync()
  }
})( document, window, navigator, console.log );

// Detección del Estado de la conexión
( ( d, w, n, c) => {
  const header = document.querySelector( 'Header' ),
        metaTagTheme = document.querySelector( 'meta[name=theme-color]' )

  function networkStatus ( e ) {
    c( e, e.type )

    if ( n.onLine ) {
      metaTagTheme.setAttribute( 'content', '#f7df1e' )
      header.classList.remove( 'u-offline' )
      alert( 'Conexión recuperada :D' )
    } else {
      metaTagTheme.setAttribute( 'content', '#666' )
      header.classList.add( 'u-offline')
      alert( 'Conexión perdida ;(' )
    }
  }

  d.addEventListener( 'DOMContentLoaded', e => {
    if ( !n.onLine ) {
      networkStatus( this )
    }

    w.addEventListener( 'online', networkStatus )
    w.addEventListener( 'offline', networkStatus )
  })

})( document, window, navigator, console.log );

// Aplicación Demo interactuando con el API de Github y la sincronización de fondo
( ( d, w, n, c) => {
  const userInfo = d.querySelector( '.github-user' ),
        searchForm = d.querySelector( '.github-user-form' )

  function fetchGithubUser ( username, requestFromBGSync ) {
    let name = username || 'escueladigital',
        url = `https://api.github.com/users/${name}`

    fetch( url, { method: 'GET' } )
      // Convierte a formato .JSON
      .then( response => response.json() )

      // Template a mostrar en la pantalla
      .then( userData => {
        let template = `
          <article class="github-user-info">
            <h2>${userData.name}</h2>
            <img alt="${userData.login}" src="${userData.avatar_url}" />
            <p>${userData.bio}</p>
            <ul>
              <li>User Github: ${userData.login}</li>
              <li>Url Github: ${userData.html_url}</li>
              <li>Seguidores: ${userData.followers}</li>
              <li>Siguiendo: ${userData.following}</li>
              <li>Ubicación: ${userData.location}</li>
            </ul>
          </article>
        `

        // Incrusta en la clase .github-user el template
        userInfo.innerHTML = template
      })

      // Muestra el error
      .catch( err => {
        c( err )
      })
  }

  fetchGithubUser( localStorage.getItem( 'github' ) )

  searchForm.addEventListener( 'submit', e => {
    e.preventDefault()

    let user = d.getElementById( 'search' ).value

    // Em caso de estar vació, regresate
    if ( user === '' ) return;

    localStorage.setItem( 'github', user )
    fetchGithubUser( user )

    e.target.reset()
  })
})( document, window, navigator, console.log );

// ( ( d, w, n, c) => {

// })( document, window, navigator, console.log );
