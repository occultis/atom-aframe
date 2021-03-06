'use babel'

import {CompositeDisposable} from 'atom'
import semver from 'semver'
import * as cnf from './config'
import commands from './commands'

export default {
  // CompositeDisposable
  subscriptions: null,
  // is package valid and can be loaded
  valid: false,

  /**
   * Called before atom-aframe package is activated
   *
   * @param  {[Object]} state data from the last time the window was serialized
   */
  initialize (state) {
    this.subscriptions = new CompositeDisposable()
    this.verifyConfig()
    this.verifyAtom()
  },

  /**
   * Called when atom-aframe package is activated
   *
   * @param  {Object} state data from the last time the window was serialized
   */
  activate (state) {
    if (!this.valid) { return }
    this.setupCommands()
  },

  /**
   * Called when the window is shutting down so we can restore atom-aframe
   * to where the user left off.
   *
   * @return {String} JSON to represent the state of atom-aframe
   */
  serialize () {
    return '{"serialized":  true }'
  },

  /**
   * Called when the window is shutting down so release external resources
   * like watching project packag.json for A-Frame version
   */
  deactivate () {
    this.dispose()
  },

  /**
   * Dispose whole package and it's subscriptions
   *
   * @return {[type]} [description]
   */
  dispose () {
    // Dispose all subscriptions
    this.subscriptions.dispose()
  },

  /**
   * Reqister all commands
   */
  setupCommands () {
    for (const cmd of commands.list) {
      this.subscriptions.add(cmd)
    }
  },

  /**
   * Verify Configuration
   */
  verifyConfig () {
    // If AFRAME_DEPREACTED_CONFIG is set then handle these entries
    if (cnf.AFRAME_DEPREACTED_CONFIG.length > 0) {
      for (let c of cnf.AFRAME_DEPREACTED_CONFIG) {
        atom.config.unset(`atom-aframe.${c}`)
      }
    }
  },

  /**
   * Can package be activated for that Atom version
   */
  verifyAtom () {
    const validVersion = semver.gte(atom.appVersion, cnf.AFRAME_ATOM_MINVER)
    if (!validVersion && atom.config.get('atom-aframe.global.notifOnActivationFailure')) {
      const notification = atom.notifications.addWarning('**Package atom-aframe will not load**', {
        dismissable: true,
        icon: 'flame',
        description: 'Package **atom-aframe** requires Atom `v' + cnf.AFRAME_ATOM_MINVER + '` but you are running `v' + atom.appVersion + '`.'
      })
      if (this.subscriptions) {
        this.subscriptions.add({dispose: () => {
          notification.dismiss()
        }})
      }
    }
    this.valid = validVersion
  },

  /**
   * Load autocomplete provider
   */
  provideAutocomplete () {
    console.warn('should provide autocomplete')
  },

  /**
   * Setup statusbar
   */
  consumeStatusBar () {
    console.warn('should set status bar')
  }
}
