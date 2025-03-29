## For debugging

https://claude.site/artifacts/8cd4d314-a491-46cf-9e4d-ec95e60f380b

### Problem 1

```
def has_all_unique_chars(s):
	uniq_map = {}
	for c in s:
		if c in uniq_map:
			print(c)
			return False
		else:
			uniq_map[c] = 1
	return True
```

### Problem 2

```
def has_all_unique_chars(s):
	uniq_map = {}
	for c in s:
		if c in uniq_map:
			print(c)
			return False
		else:
			uniq_map[c] = 1
	return True
	
def is_substring_unique(s, start, end):
    return has_all_unique_chars(s[start:end+1])
``` 	

### Problem 3

```
def all_uniq(s):
	uniq_map = {}
	for c in s:
		if c in uniq_map:
			return False
		else:
			uniq_map[c] = 1
	return True

def find_all_unique_substrings(s):
	all_subs = set([])
	for i in range(0, len(s)+1):
		for j in range(i+1, len(s)+1):
			if all_uniq(s[i:j]):
				all_subs.add(s[i:j])
			
	return sorted(list(all_subs))
```
