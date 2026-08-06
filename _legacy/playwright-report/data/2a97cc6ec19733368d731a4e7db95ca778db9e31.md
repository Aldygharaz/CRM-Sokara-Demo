# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: deal-management.spec.js >> Deal Management Operational Flows >> should archive a deal properly
- Location: tests\deal-management.spec.js:53:3

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e7]: search
      - textbox "Search pipeline... (Ctrl+K)" [ref=e8]
    - generic [ref=e9]:
      - generic [ref=e10]:
        - button "IDR" [ref=e11] [cursor=pointer]
        - button "USD" [ref=e12] [cursor=pointer]
      - button "help_outline" [ref=e13] [cursor=pointer]
      - button "dark_mode" [ref=e15] [cursor=pointer]
      - button "add" [ref=e17] [cursor=pointer]
  - generic [ref=e19]:
    - generic [ref=e20]:
      - generic [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]: psychology
          - text: Showcase Orchestration AI
        - heading "\"Bayangkan Anda memiliki 20 leads aktif minggu ini. Mana yang paling bernilai, dan keputusan apa yang dapat meningkatkan hasil penutupan deal? Geser variabelnya untuk melihat proyeksi real-time.\"" [level=2] [ref=e24]
      - button "Kelola Pipeline →" [ref=e25] [cursor=pointer]
    - generic [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - paragraph [ref=e29]: Gross pipeline value
          - generic [ref=e30]: ↑ +14.2%
        - paragraph [ref=e31]: Rp 472.5M
      - generic [ref=e32]:
        - generic [ref=e33]:
          - paragraph [ref=e34]: Active opportunities
          - generic [ref=e35]: 4 sales reps
        - paragraph [ref=e36]: 18 leads
      - generic [ref=e37]:
        - generic [ref=e38]:
          - paragraph [ref=e39]: Median deal size
          - generic [ref=e40]: ↑ +8.5%
        - paragraph [ref=e41]: Rp 38.5M
      - generic [ref=e42]:
        - generic [ref=e43]:
          - paragraph [ref=e44]: Historical win rate
          - generic [ref=e45]: Target 65%
        - paragraph [ref=e46]: 68.5%
    - generic [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]:
          - heading "tune Simulator \"what-if\" strategi sales" [level=2] [ref=e50]:
            - generic [ref=e51]: tune
            - text: Simulator "what-if" strategi sales
          - paragraph [ref=e52]: Geser slider untuk melihat proyeksi revenue dan win-rate.
        - generic [ref=e53]:
          - button "Percepat response time" [ref=e54] [cursor=pointer]
          - button "Diskon volume" [ref=e55] [cursor=pointer]
          - button "Prioritas referral" [ref=e56] [cursor=pointer]
        - generic [ref=e58]:
          - generic [ref=e59]:
            - generic [ref=e60]: Target response time reps
            - generic [ref=e61]: 18 jam
          - slider [ref=e62]: "18"
          - generic [ref=e63]:
            - generic [ref=e64]: Cepat (<2 jam)
            - generic [ref=e65]: Lambat (72+ jam)
        - generic [ref=e66]:
          - generic [ref=e67]:
            - paragraph [ref=e68]: Proyeksi Tambahan Revenue
            - paragraph [ref=e69]: +Rp 139.1M
          - generic [ref=e70]:
            - paragraph [ref=e71]: Estimasi Win Rate & Velocity
            - generic [ref=e72]:
              - paragraph [ref=e73]: 92%
              - generic [ref=e74]:
                - generic [ref=e75]: arrow_upward
                - text: +47.0% (5d saved)
        - paragraph [ref=e77]: Respons <18 jam diproyeksikan menambah +Rp 139.1M revenue dan meningkatkan win rate +47.0%.
        - generic [ref=e79]:
          - paragraph [ref=e80]: Top Deals Affected by Simulation
          - generic [ref=e81]:
            - generic [ref=e82]:
              - paragraph [ref=e83]: PT Maju Bersama
              - generic [ref=e84]:
                - generic [ref=e85]: negotiation
                - generic [ref=e86]: 80% → 98%
            - generic [ref=e87]:
              - paragraph [ref=e88]: TechFlow Indonesia
              - generic [ref=e89]:
                - generic [ref=e90]: proposal
                - generic [ref=e91]: 85% → 98%
            - generic [ref=e92]:
              - paragraph [ref=e93]: IndoRetail Group
              - generic [ref=e94]:
                - generic [ref=e95]: proposal
                - generic [ref=e96]: 60% → 98%
        - generic [ref=e97]:
          - generic [ref=e98]:
            - generic [ref=e99]:
              - generic [ref=e100]: rocket_launch
              - text: Recommended Causal Action Plan
            - generic [ref=e101]: Highest ROI
          - paragraph [ref=e102]: Terapkan skenario ini secara otomatis ke seluruh 18 active deals untuk memaksimalkan proyeksi revenue dan kecepatan penutupan deal.
          - button "task_alt Terapkan Strategi Ini ke Active Pipeline" [ref=e103] [cursor=pointer]:
            - generic [ref=e104]: task_alt
            - text: Terapkan Strategi Ini ke Active Pipeline
      - generic [ref=e105]:
        - heading "bolt Smart follow-up priority" [level=3] [ref=e107]:
          - generic [ref=e108]: bolt
          - text: Smart follow-up priority
        - generic [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]:
              - generic [ref=e112]:
                - heading "PT Maju Bersama" [level=4] [ref=e113]
                - paragraph [ref=e114]: Enterprise • Rp 45.0M
              - generic [ref=e115]: Stuck 8 hari
            - paragraph [ref=e116]: Win score 80%. Diskon 5% historis mempercepat closing 40%.
            - button "Exec action" [ref=e118] [cursor=pointer]
          - generic [ref=e119]:
            - generic [ref=e120]:
              - generic [ref=e121]:
                - heading "IndoRetail Group" [level=4] [ref=e122]
                - paragraph [ref=e123]: Mid-Market • Rp 32.0M
              - generic [ref=e124]: 60% win
            - paragraph [ref=e125]: Stage proposal. Waktu optimal untuk follow-up langsung.
            - button "Exec action" [ref=e127] [cursor=pointer]
          - generic [ref=e128]:
            - generic [ref=e129]:
              - generic [ref=e130]:
                - heading "Nusa Infrastruktur" [level=4] [ref=e131]
                - paragraph [ref=e132]: Enterprise • Rp 65.0M
              - generic [ref=e133]: 95% win
            - paragraph [ref=e134]: Stage negotiation. Waktu optimal untuk follow-up langsung.
            - button "Exec action" [ref=e136] [cursor=pointer]
          - generic [ref=e137]:
            - generic [ref=e138]:
              - generic [ref=e139]:
                - heading "TechFlow Indonesia" [level=4] [ref=e140]
                - paragraph [ref=e141]: Mid-Market • Rp 12.5M
              - generic [ref=e142]: 85% win
            - paragraph [ref=e143]: Stage proposal. Waktu optimal untuk follow-up langsung.
            - button "Exec action" [ref=e145] [cursor=pointer]
```