/**
 * @employSchema
 * @eventListeners
 * @sensibleDefaults
 * @svgSrc
 * @documentation
 * @iconUniformNames
 * @objectifyEventListeners
 * @documentationApi
 * @minimizeProperties
 * @distinctEventListeners
 * @parentElementSelector
 * @propertiesElemUnderscore
 * @propertify
 * @methodNamingConventions
 * @propertyNamingConventions
 */




/**
 * @constant {String} API_URL
 */
function Api() {

    /**
     * 
     * @property
     * @private
     */
    this._fd = new FormData();

    /**
     * 
     * @property
     * @private
     */
    this._xhr = null;

    /**
     * 
     * @property
     * @private
     */
    this._jsonResponse = null;

    /**
     * 
     * @property
     * @private
     */
    this._callback = null;

    /**
     * 
     * @property
     * @private
     */
    this._url = '/api/query.php';

    /**
     * 
     * @property
     * @private
     */
    this._timeout = 0;

    /**
     * 
     * @property
     * @private
     */
    this._method = 'POST';

    /**
     * 
     * @property
     * @private
     */
    this._async = true;




    this._fd.append( 'authuser', localStorage.getItem( 'authuser' ) );
    this._fd.append( 'authtoken', localStorage.getItem( 'authtoken' ) );

    if ( typeof API_URL === 'string' ) {

        this._url = API_URL;

    }

};

/**
 * 
 * @returns {Api}
 */
Api.prototype.nonAuth = function() {

    this._fd[ 'delete' ]( 'authuser' );
    this._fd[ 'delete' ]( 'authtoken' );

    return this;

};

/**
 * 
 * @param {Object} data 
 * @returns {Api}
 */
Api.prototype.payload = function( data ) {

    for ( entry in data ) {

        this._fd.append( entry, data[ entry ] );

    }

    return this;

};

/**
 * 
 * @param {String} endpoint 
 * @returns {Api}
 */
Api.prototype.end = function( endpoint ) {

    this._fd.append( 'action', endpoint );

    return this;

};

/**
 * 
 * @param {URL} url
 * @returns {Api}
 */
Api.prototype.url = function( url ) {

    this._url = url;

    return this;

};

/**
 * 
 * @param {Number} miliseconds 
 * @returns {Api}
 */
Api.prototype.setTimeout = function( miliseconds ) {

    this._timeout = miliseconds;

    return this;

};

/**
 * 
 * @param {Function} callback 
 */
Api.prototype.call = function( callback ) {

    this._callback = callback;

    this._xhr = new XMLHttpRequest();
    this._xhr.open( this._method, this._url, this._async );
    this._xhr.timeout = this._timeout;

    this._xhr.onreadystatechange = function() {

        if ( this._xhr.readyState == 4 ) {

            if ( this._xhr.status === 200 ) {

                this._jsonResponse = JSON.parse( this._xhr.response );
                this._callback( this._jsonResponse );

                if ( typeof api_onStatus200 === 'function' ) {

                    api_onStatus200( this._jsonResponse );

                }

            } else if ( this._xhr.status === 403 ) {

                if ( typeof api_onStatus403 === 'function' ) {

                    api_onStatus403( this._xhr.response );

                }

            } else if ( this._xhr.status === 500 ) {

                if ( typeof api_onStatus500 === 'function' ) {

                    api_onStatus500( this._xhr.response, this._fd );

                }

            }

            return this;

        }

    }.bind( this );

    this._xhr.send( this._fd );

};