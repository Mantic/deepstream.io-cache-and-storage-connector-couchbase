'use strict'

/* global describe, expect, it, jasmine */
const expect = require('chai').expect
const StorageConnector = require('../src/connector.js')
const EventEmitter = require('events').EventEmitter
const settings = { bucket: process.env.COUCHBASE_BUCKET, host: process.env.COUCHBASE_HOST, password: process.env.COUCHBASE_PW }
const MESSAGE_TIME = 20

describe( 'the connector has the correct structure: it', () => {
  var storageConnector

  it( 'throws an error if required connection parameters are missing', () => {
    expect( () => { new StorageConnector( 'gibberish' ) } ).to.throw()
  })

  it( 'creates the storageConnector', ( done ) => {
    storageConnector = new StorageConnector( settings )
    expect( storageConnector.isReady ).to.equal( false )
    storageConnector.on( 'ready', done )
  })

  it( 'implements the cache/storage connector interface', () =>  {
    expect( storageConnector.name ).to.be.a( 'string' )
    expect( storageConnector.version ).to.be.a( 'string' )
    expect( storageConnector.get ).to.be.a( 'function' )
    expect( storageConnector.set ).to.be.a( 'function' )
    expect( storageConnector.delete ).to.be.a( 'function' )
    expect( storageConnector instanceof EventEmitter ).to.equal( true )
  })

  it( 'retrieves a non existing value', ( done ) => {
    storageConnector.get( 'someValue', ( error, value ) => {
      expect( error ).to.equal( null )
      expect( value ).to.equal( null )
      done()
    })
  })

  it( 'sets a value', ( done ) => {
    storageConnector.set( 'someValue', {  _d: { v: 10 }, firstname: 'Wolfram' }, ( error ) => {
      expect( error ).to.equal( null )
      done()
    })
  })

  it( 'retrieves an existing value', ( done ) => {
    storageConnector.get( 'someValue', ( error, value ) => {
      expect( error ).to.equal( null )
      value.cas = null; // ignore cas number
      expect( value ).to.deep.equal( {  _d: { v: 10 }, firstname: 'Wolfram', cas: null } )
      done()
    })
  })

  it( 'deletes a value', ( done ) => {
    storageConnector.delete( 'someValue', ( error ) => {
      expect( error ).to.equal( null )
      done()
    })
  })

  it( 'Can\'t retrieve a deleted value', ( done ) => {
    storageConnector.get( 'someValue', ( error, value ) => {
      expect( error ).to.equal( null )
      expect( value ).to.equal( null )
      done()
    })
  })

})
