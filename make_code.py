"""Make the SHA-256 hash of a supporter code to paste into TEA_PASS.codes (in tea-hub.js or support.js).
Usage: python3 pwa/make_code.py MYCODE123   (codes are case-insensitive)"""
import hashlib, sys
for c in sys.argv[1:]:
    print(c.strip().upper(), '->', hashlib.sha256(c.strip().upper().encode()).hexdigest())
