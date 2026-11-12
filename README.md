# 딥마인 : 광맥 타이쿤 v1.0

인터넷 연결 없이 즐기는 세로형 안드로이드 채굴 게임. WebView 안에서 Canvas로 광석, 곡괭이, 동굴과 파편을 직접 그립니다. 외부 이미지, 광고, 결제, 서버가 없습니다.

## 플레이

- 광석 터치 → 곡괭이 타격 → 파괴 시 가방 획득 → 모두 판매 → 장비 강화.
- 석탄부터 별빛석까지 10종. 도감에서 현재 일반 추첨 확률 확인 가능.
- 곡괭이 피해, 행운 가중치, 치명타 확률, 자동 채굴, 판매가를 골드로 강화.
- 80번째 광석에 에픽 이상 보장. 에픽 이상 등장 시 보장 카운터 초기화.
- 연속 터치 콤보, 5% 풍부한 광맥(내구도 2배·획득량 3배), 폭탄, 반복 채굴 의뢰.
- 신규 광물 발견마다 판매가 +2%. 자동 채굴기 오프라인 골드 최대 4시간.
- 현재 광석과 내구도 포함 기기 자동 저장. 앱 데이터 삭제/재설치 시 소실 가능.

## GitHub에서 APK 만들기

1. 빈 GitHub 저장소를 만듭니다. 저장소 이름 예: `DeepMine`.
2. 이 폴더 **안의 내용**을 저장소 최상위에 올립니다. `app`, `settings.gradle`, `.github`가 최상위에 있어야 합니다.
3. `.github/workflows/android.yml`도 포함해야 합니다. Windows 탐색기에서는 숨긴 파일 표시를 켭니다.
4. main/master에 push하면 Actions의 `Android APK`가 실행됩니다. 수동으로는 Actions → Android APK → Run workflow.
5. 성공한 실행 화면의 Artifacts에서 `DeepMine-APK`를 다운로드하고 압축 해제 후 `app-debug.apk`를 설치합니다.

테스트용 debug 서명 APK입니다. 정식 배포 전에는 사용자 소유의 고정 release 키로 서명해야 합니다.

## 개발

- JDK 17, Gradle 8.9, Android SDK 35 필요.
- `gradle assembleDebug --no-daemon`
- 로직 검증: `node tests/engine.test.cjs`
- 빠른 플레이: 데스크톱 브라우저에서 `app/src/main/assets/index.html` 열기.
- `engine.js`: 상태, 추첨, 경제, 저장 모델. `game.js`: UI, Canvas 애니메이션, 효과음.
- Android 패키지명: `com.peter.deepmine` / minSdk 26(Android 8.0).

## 검증 상태

채굴·판매·강화·보장 추첨·폭탄·오프라인 수익 상한·의뢰·저장 복원·시드 고정 10만 회 추첨 테스트 통과.
현재 작성 환경에는 Android SDK/Gradle이 없어 APK 컴파일은 미실행입니다. Chromium 시각 테스트는 실행 환경의 socket 권한 제한으로 시작되지 않았습니다. GitHub Actions 첫 빌드와 실제 Android 기기 설치 검증이 필요합니다.
