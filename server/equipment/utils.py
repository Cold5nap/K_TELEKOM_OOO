PATTERN_MAP = {
    'N': r'[0-9]',
    'A': r'[A-Z]',
    'a': r'[a-z]',
    'X': r'[A-Z0-9]',
    'Z': r'[-_@]'
}


def has_invalid_characters(mask: str) -> bool:
    """Проверяет, содержит ли маска недопустимые символы."""
    valid_chars = set(PATTERN_MAP.keys())
    for char in mask:
        if char not in valid_chars:
            return True
    return False