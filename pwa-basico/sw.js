const CACHE_NAME = 'pwa-demo-edteam-cache-v1',

      // URL's a cachear
      urlsToCache = [
        '/',
        './',
        './?utm=homescreen',
        './index.html',
        './index.html?utm=homescreen',
        './style.css',
        './script.js',
        './sw.js',
        './favicon.ico',
        'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
      ]

// Instanlación del ServiceWorker
self.addEventListener( 'install', e => {
  console.log( 'Evento: SW Instalado' )

  // Método para registrar el caché
  e.waitUntil(

    // Abre el caché, en caso de no existir lo crea
    caches.open( CACHE_NAME )

      // Se agrega al objeto todas las caches ya definidas
      .then( cache => {
        console.log( 'Archivos en caché quedaron registrados' )
        return cache.addAll( urlsToCache )
      })

      // En caso de error, mostrará lo que falló
      .catch( err => console.log( 'Fallo el caché', err ) )
  )
})

// Activación del ServiceWorker
self.addEventListener( 'activate', e => {
  console.log( 'Evento: SW Activado' )

  // Generación de la variable para la caché que sea cargar
  const cacheList = [ CACHE_NAME ]

  // Interactuar con la caché
  e.waitUntil(

    // Obtener las llaves de la caché
    caches.keys()

      // Depura el caché
      .then( cachesName => {
        return Promise.all(

          // Generá un mapa
          cachesName.map( cachesName => {

            // Comprueba de que si hay cambios en el listado de caché
            if ( cacheList.indexOf( cachesName ) === -1 ) {

              // Elimina
              return caches.delete( cachesName )
            }
          })
        )
      })

      // Caché se ha limpiado
      .then( () => {
        console.log( 'El caché esta limpiado y actualizado')

        // El ServiceWorker que este a la espera de posibles cambios
        return self.clients.claim()
      })
  )
})

// Recupera caché
self.addEventListener( 'fetch', e => {
  console.log( 'Evento: SW Recuperando' )

  // Mira el cache al SW
  e.respondWith(

    // Busca coincidencias del caché con la del SW
    caches.match( e.request )

      .then( res => {
        // Si la respuesta es valida, retornará todos los elementos de la caché
        if ( res ) {
          return res
        }

        // Consulta la petición original
        return fetch( request )
          .then( res => {

            // Por cada URL que traiga el cache, se clonará la respuesta
            let resToCache = res.clone()

            // Se colocarán en el cache
            caches.open( cacheName )
              .then( cache => {
                cache
                  // Todo lo que este dentro de la petición se le asignará a la caché
                  .put( request, resToCache)

                  // En caso de error
                  // Imprimirá la URL que no se adjunta al caché y el respectivo mensaje de error
                  .catch( err => console.log( `${request.url}: ${err.message}` ) )
              })

              // Devuelve la respuesta
              return res
          })
      })
  )
})

// Mandar notificación
self.addEventListener( 'push', e => {
  console.log( 'Evento: Push' )

  // Mensaje para mostrar la notificación
  let title = 'Push Notification Demo',
      options = {
        body: 'Click para regresar a la aplicación',
        icon: './img/icon_192x192.png',
        vibrate: [100, 50, 100],
        data: { id: 1 },
        actions: [
          { 'action': 'Sí', 'title': 'Amo esta app :D', 'icon': './img/icon_192x192.png' },
          { 'action': 'No', 'title': 'No me gusta esta app ;(', 'icon': './img/icon_192x192.png' }
        ]
      }

  // Manda a llamar la notificación con el título y sus opciones
  e.waitUntil( self.registration.showNotification( title, options ) )
})

// Extras del evento de notificación
self.addEventListener( 'notificationclick', e => {
  console.log( e )

  // En caso de que se diga que si, abrirá un nueva ventana
  if ( e.action === 'Sí' ) {
    console.log( 'Amo esta app' )
    clients.openWindow( 'https://ed.team' )
  }

  // En caso de elegir no, solamente manda un mensaje de consola
  else if ( e.action === 'No' ) {
    console.log( 'No me gusta esta app' )
  }

  // Cierra la notificación
  e.notification.close()
})


self.addEventListener( 'sync', e => {
  console.log( 'Evento: Sincronización de fondo', e )

  // Revisamos que la etiqueta de sincronización sea la que definimos o la que definimos en la devtools
  if ( e.tag === 'github' || e.tag === 'test-tag-from-devtools') {
    e.waitUntil(
      // Comprueba cuantas pestañas se tiene abiertas y enviar un postMessage
      self.clients.matchAll()
        .then( all => {
          return all.map( client => {
            return client.postMessage( 'Online' )
          })
        })
        .catch( err => c( err ) )
    )
  }
})
