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

    /**
     * 
     * @property
     * @private
     */
    this._enforceJson = false;

    /**
     * 
     * @property
     * @private
     */
    this._rawUrl = '';

    /**
     * 
     * @property
     * @private
     */
    this._authuser = null;

    /**
     * 
     * @property
     * @private
     */
    this._authtoken = null;

    /**
     * 
     * @property
     * @private
     */
    this._token = null;




    this._token = localStorage.getItem( 'token' );
    this._authuser = localStorage.getItem( 'authuser' );
    this._authtoken = localStorage.getItem( 'authtoken' );

    if ( typeof API_URL === 'string' ) {

        this._url = API_URL;

    }

};

/**
 * 
 * @returns {Api}
 */
Api.prototype.nonAuth = function() {

    this._authuser = null;
    this._authtoken = null;

    return this;

};

/**
 * 
 * @param {Object} data 
 * @returns {Api}
 */
Api.prototype.payload = function( data ) {

    for ( var entry in data ) {

        this._fd.append( entry, data[ entry ] );

    }

    if ( this._rawUrl !== '' ) {

        this._url = this._rawUrl.replace( /:([a-zA-Z0-9_]+)/g, function ( match, p1 ) {

            if ( data.hasOwnProperty( p1 ) ) {

                return encodeURIComponent( data[ p1 ] );

            }

            return match;

        } );

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

Api.prototype.delete = function( url ) {

    this._method = 'DELETE';

    this.url( url );

    return this;

};

Api.prototype.put = function( url ) {

    this._method = 'PUT';

    this.url( url );

    return this;

};

Api.prototype.post = function( url ) {

    this._method = 'POST';

    this.url( url );

    return this;

};

Api.prototype.get = function( url ) {

    this._method = 'GET';

    this.url( url );

    return this;

};

/**
 * 
 * @param {URL} url
 * @returns {Api}
 */
Api.prototype.url = function( url ) {

    this._rawUrl = url;
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

Api.prototype.enforceJson = function() {

    this._enforceJson = true;

    return this;

};

Api.prototype.setMethod = function( method ) {

    this._method = method;

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

    if ( this._token !== null ) {

        this._xhr.setRequestHeader( 'Authorization', 'Bearer ' + this._token );

    }

    if ( this._authtoken !== null ) {

        this._xhr.setRequestHeader( 'authuser', this._authuser );
        this._xhr.setRequestHeader( 'authtoken', this._authtoken );

        if ( this._enforceJson === false ) {

            this._fd.append( 'authuser', this._authuser );
            this._fd.append( 'authtoken', this._authtoken );

        }

    }

    if ( this._enforceJson === false ) {

        this._xhr.send( this._fd );

    } else {

        this._xhr.setRequestHeader( 'Content-Type', 'application/json' );

        var formDataObj = {};
        
        for ( var pair of this._fd.entries() ) {

            formDataObj[ pair[ 0 ] ] = pair[ 1 ];

        }

        this._xhr.send( JSON.stringify( formDataObj ) );

    }

};