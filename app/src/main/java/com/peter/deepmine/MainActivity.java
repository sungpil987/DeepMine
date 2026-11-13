package com.peter.deepmine;
import android.app.Activity;
import android.content.ClipboardManager;
import android.content.ClipData;
import android.content.Context;
import android.webkit.JavascriptInterface;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.WindowManager;
public class MainActivity extends Activity {
    private WebView game;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        game = new WebView(this);
        game.setBackgroundColor(0xff0b141e);
        game.getSettings().setJavaScriptEnabled(true);
        game.getSettings().setDomStorageEnabled(true);
        game.getSettings().setAllowFileAccess(false);
        game.getSettings().setAllowContentAccess(false);
        game.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) { return true; }
        });
        game.addJavascriptInterface(new BackupClipboard(), "Android");
        setContentView(game);
        game.loadUrl("file:///android_asset/index.html");
    }
    public class BackupClipboard {
        @JavascriptInterface public void copyBackup(String text) {
            if (text == null || text.length() > 100000) return;
            runOnUiThread(() -> {
                ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                clipboard.setPrimaryClip(ClipData.newPlainText("DeepMine backup", text));
            });
        }
    }
    @Override protected void onPause() { game.evaluateJavascript("window.saveGame && window.saveGame()", null); game.onPause(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if(game != null) game.onResume(); }
    @Override protected void onDestroy() { game.destroy(); super.onDestroy(); }
}
