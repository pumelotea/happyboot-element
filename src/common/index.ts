import { getCurrentInstance } from 'vue'
import { HappyKitFramework, HappyKitRouter, HappyKitSecurity } from 'happykit'
import { Router, RouteLocationNormalized } from 'vue-router'
import { Emitter } from 'mitt'
import { Store } from 'vuex'

export interface Self {
  $: any
  $el: any
  $attrs: any
  $emit: Function
  $forceUpdate: Function
  $refs: any
  $slots: any

  //element
  $alert: Function
  $confirm: Function
  $notify: Function
  $loading: Function
  $message: Function
  $messageBox: Function
  $msgbox: Function

  //custom
  $api: any,
  $http: any
  $bus: Emitter
  $happykit: HappyKitFramework
  $security: HappyKitSecurity

  //route
  $router: HappyKitRouter
  $route: RouteLocationNormalized
  $store: Store<any>

  [propName: string]: any
}

export function self(): Self {
  const proxy = getCurrentInstance()!.proxy! as any
  return proxy as Self
}

