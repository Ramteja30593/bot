package com.example.retailbot

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.MotionEvent
import android.webkit.*
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        val cookieManager = android.webkit.CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        // 🔐 Request microphone permission (runtime)
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), 1)
        }

        // 🌐 Handle navigation inside app
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                view?.loadUrl(url ?: "")
                return true
            }
        }

        // 🎤 Enable microphone + permissions
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.grant(request.resources)
            }
        }

        // ⚙️ WebView settings
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true

            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT

            useWideViewPort = true
            loadWithOverviewMode = true

            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false

            loadsImagesAutomatically = true
            allowFileAccess = true
            allowContentAccess = true

            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

            userAgentString = WebSettings.getDefaultUserAgent(this@MainActivity)
        }

        // 👆 Touch fix (important for mobile UI)
        webView.setOnTouchListener { v, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN,
                MotionEvent.ACTION_MOVE -> {
                    v.parent.requestDisallowInterceptTouchEvent(true)
                }
                MotionEvent.ACTION_UP -> {
                    v.performClick()
                }
            }
            false
        }

        // ✅ Interaction settings
        webView.isClickable = true
        webView.isFocusable = true
        webView.isFocusableInTouchMode = true

        // 🎨 Clean UI
        webView.isVerticalScrollBarEnabled = false
        webView.isHorizontalScrollBarEnabled = false

        // 🚀 Load your app
        webView.loadUrl("https://bot-mu-inky.vercel.app")
    }

    // 🔙 Back navigation
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}