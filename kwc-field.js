(function () {
  var kwcField = {
    is: 'kwc-field',

    properties: {
      /**
       * Field errors (input validations or additional validations)
       */
      errors: {
        type: Array,
        value: []
      },
          
      /**
       * Has this component at least an error?
       * Used to hide .errors div.
       */
      hasNotError: {
        type: Boolean,
        computed: "_computeHasNotError(errors)"
      },
          
      /**
       * Duration before calling async verifications.
       */
      delayAsync: {
        type: Number,
        value: 500
      },
          
      /**
       * List of verifications from #verifiy
       */
      _verifications: {
        type: Array,
        value: []
      },
          
      /**
       * List of async verifications form verifyAsync
       */
      _asyncVerifications: {
        type: Array,
        value: []
      },
          
      /**
       * This properties is used to avoid setting errors when field was updated another time
       */
      _currentCheck: {
        type: Number,
        value: 0
      }
    },

    attached: function () {
      var that = this
      Polymer.dom(this).querySelector(".kwc-field-field").addEventListener("input", function (e) {
        that._check()
      })
      this._check()
    },
        
    /**
     * This field must verify given verification, otherwise, given message will be displayed.
     * The verification function must return true when the value is valid.
     * 
     * @param {String} message:        The message to display when invalid
     * @param {function} verification: The function to call to check if the field is valid
     * @return {this}
     */
    verify: function (message, verification) {
      this._verifications = this._verifications.concat([{
        message: message,
        verification: verification
      }])
      return this
    },
        
    /**
     * This field must verify given verification, otherwise, given message will be displayed.
     * The verification function must return a promise returning true when the value is valid.
     * Unlike #verify, this method will be called after #delayAsync milliseconds.
     * Its use is for async verification, as an XHR call.
     * 
     * @param {String} message:        The message to display when invalid
     * @param {function} verification: The function to call to check if the field is valid
     * @return {this}
     */
    verifyAsync: function (message, verification) {
      this._asyncVerifications = this._asyncVerifications.concat([{
        message: message,
        verification: verification
      }])
      return this
    },
        
    /**
     * The input was just updated, check if the new value is valid
     */
    _check: function () {
      this._currentCheck++
      // Cancel the previous async verification
      if (this._asyncVerificationTimer !== null) {
        clearTimeout(this._asyncVerificationTimer)
        this._asyncVerificationTimer = null
      }

      this._immediateCheck()

      if (this.errors.length === 0) {
        // Call async verification only when there is no error
        var that = this
        this._asyncVerificationTimer = setTimeout(function () {
          that._asyncCheck()
        }, this.delayAsync)
      }
    },
        
    /**
     * Checks all non-async validations and field internal validation. 
     */
    _immediateCheck: function () {
      var field = Polymer.dom(this).querySelector(".kwc-field-field")
      var errors = []
      if (!field.checkValidity()) {
        errors.push(field.validationMessage)
      }
      this._verifications.forEach(function (verification) {
        if (!verification.verification(field.value)) {
          errors.push(verification.message)
        }
      })
      this.errors = errors
    },
        
    /**
     * Calls async verifications and update field errors when terminated.
     */
    _asyncCheck: function () {
      var currentCheck = this._currentCheck
      var value = Polymer.dom(this).querySelector(".kwc-field-field").value
      var that = this
      Promise.all(this._asyncVerifications.map(function (asyncVerification) {
        return asyncVerification.verification(value)
      })).then(function (results) {
        if (that._currentCheck === currentCheck) {
          var errors = []
          for (var i = 0, c = that._asyncVerifications.length; i < c; i++) {
            if (!results[i]) {
              errors.push(that._asyncVerifications[i].message)
            }
          }
          that.errors = errors
        } //else ignore
      })
    },
        
    /**
     * See #hasNotError
     */
    _computeHasNotError(errors) {
      return errors.length == 0
    }
  }
      
  /**
   * Current field value
   */
  Object.defineProperty(kwcField, "value", {
    get: function () {
      return Polymer.dom(this).querySelector(".kwc-field-field").value
    }
  })

  Polymer(kwcField)
})()