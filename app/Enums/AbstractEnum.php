<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 28/04/18
 * Time: 23:24
 */

namespace App\Enums;

use Doctrine\Common\Inflector\Inflector;

/**
 * https://github.com/greg0ire/enum
 * @author Grégoire Paris <postmaster@greg0ire.fr>
 * @author Sullivan Senechal <soullivaneuh@gmail.com>
 */
abstract class AbstractEnum
{
    /**
     * @var string
     */
    public static $defaultNamespaceSeparator = '_';

    // TODO: PayMe - it's also possible to use APC or Laravel Cache::put/get in here
    private static $constCache = [];
    protected static $aliases = [];

    /**
     * Uses reflection to find the constants defined in the class and cache
     * them in a local property for performance, before returning them.
     *
     * @param callable|null $keysCallback
     * @param bool          $classPrefixed      True if you want the enum class prefix on each keys, false otherwise.
     * @param string        $namespaceSeparator Only relevant if $classPrefixed is set to true.
     *
     * @return array a hash with your constants and their value. Useful for
     *               building a choice widget
     */
    final public static function getConstants($keysCallback = null, $classPrefixed = false, $namespaceSeparator = null)
    {
        $namespaceSeparator = $namespaceSeparator ?: static::$defaultNamespaceSeparator;
        $enumTypes = static::getEnumTypes();
        $enums = [];

        if (!is_array($enumTypes)) {
            $enumTypes = [$enumTypes];
        }
        foreach ($enumTypes as $key => $enumType) {
            $cacheKey = is_int($key) ? $enumType : $key;

            if (!isset(self::$constCache[$cacheKey])) {
                $reflect = new \ReflectionClass($enumType);
                self::$constCache[$cacheKey] = $reflect->getConstants();
            }
            if (count($enumTypes) > 1) {
                foreach (self::$constCache[$cacheKey] as $subKey => $value) {
                    $subKey = $cacheKey.(is_int($key) ? '::' : '.').$subKey;
                    $enums[$subKey] = $value;
                }
            } else {
                $enums = self::$constCache[$cacheKey];
            }
        }

        if (is_callable($keysCallback) || $classPrefixed) {
            return array_combine(
                $classPrefixed
                    ? static::getClassPrefixedKeys($keysCallback, $namespaceSeparator)
                    : static::getKeys($keysCallback),
                $enums
            );
        }

        return $enums;
    }

    /**
     * Returns the maximum constant in the enum class, by value.
     *
     * @return string
     */
    final public static function getMaxConstant() {
        return max(self::getConstants());
    }

    /**
     * Returns constants keys.
     *
     * @param callable|null $callback A callable function compatible with array_map
     *
     * @return string[]
     */
    final public static function getKeys($callback = null)
    {
        $keys = array_keys(static::getConstants());

        if (null !== $callback) {
            return array_map($callback, $keys);
        }

        return $keys;
    }

    /**
     * @param callable|null $keysCallback
     * @return array
     */
    final public static function getKeysAndValues($keysCallback = null)
    {
        $keys = static::getKeys($keysCallback);
        $values = array_values(static::getConstants());
        return array_combine($values, $keys);
    }

    /**
     * @param callable|null $callback           A callable function compatible with array_map
     * @param string|null   $namespaceSeparator Choose which character should replace namespaces separation.
     *                                          Example: With Foo\BarMagic enum class with '.' separator,
     *                                          it will be converted to foo.bar_magic.YOUR_KEY
     *
     * @return string[]
     */
    final public static function getClassPrefixedKeys($callback = null, $namespaceSeparator = null)
    {
        $namespaceSeparator = $namespaceSeparator ?: static::$defaultNamespaceSeparator;
        $classKey = str_replace('\\', $namespaceSeparator, Inflector::tableize(static::class));

        $keys = static::getKeys(function ($key) use ($namespaceSeparator, $classKey) {
            return $classKey.$namespaceSeparator.$key;
        });

        if (is_callable($callback)) {
            return array_map($callback, $keys);
        }

        return $keys;
    }

    /**
     * Checks whether a constant with this name is defined.
     *
     * @param string $name the name of the constant
     *
     * @return bool the result of the test
     */
    final public static function isValidName($name)
    {
        return array_key_exists($name, self::getConstants());
    }

    /**
     * Checks whether a constant with this value is defined.
     *
     * @param int|string $value  the value to test
     * @param bool       $strict check the types of the value in the values
     *
     * @return bool the result of the test
     */
    final public static function isValidValue($value, $strict = false)
    {
        $values = array_values(self::getConstants());

        return in_array($value, $values, $strict);
    }

    /**
     * Checks whether a constant with this value is defined, and throw an exception otherwise
     *
     * @param int|string $value  the value to test
     * @param bool       $strict check the types of the value in the values
     *
     * @return bool true if passed the test, exception otherwise
     * @throws \InvalidArgumentException
     */
    final public static function checkValidValue($value, $strict = false)
    {
        $isValueValid = static::isValidValue($value, $strict);
        if (!$isValueValid) {
            throw new \InvalidArgumentException(static::class . ": " .$value);
        }
        return true;
    }

    /**
     * Adds possibility several classes together.
     *
     * @return string|string[]
     */
    protected static function getEnumTypes()
    {
        return [get_called_class()];
    }

    /**
     * Returns keys from a value.
     *
     * @param mixed $value
     *
     * @return string|string[]
     */
    public static function getKeysFromValue($value)
    {
        $keys = [];

        foreach (static::getConstants() as $key => $item) {
            if ($value == $item) {
                $keys[] = $key;
            }
        }

        return count($keys) === 1 ? current($keys) : $keys;
    }

    /** Return an alias from a Database value
     * @param string $value
     * @return string|null
     */
    public static function getAliasFromValue($value) {
        return $value ? array_get(static::$aliases, $value) : null;
    }

    /** Return a Database value from an alias
     * @param string $alias
     * @return string|null
     */
    public static function getValueFromAlias($alias) {
        $value = array_get(array_change_key_case(array_flip(static::$aliases), CASE_LOWER), strtolower($alias));

        return static::isValidValue($value) ? $value : null;
    }

    /** Returns a Database value array from an aliases array
     * Useful for our Query API when the clients use the aliases and we need to translate it easily to DB values
     * @param array $array
     * @param bool $checkNullInput
     * @return array
     */
    public static function getValuesFromAliasArray($array, $checkNullInput = true) {
        // Return null when input is null so we won't return an empty array
        if ($checkNullInput && $array === null) { return null; }

        // Convert input to array if it's not an array
        $array = is_array($array) ? $array : [$array];

        $result = [];
        foreach ($array as $alias) {
            $value = static::getValueFromAlias($alias);
            if (!is_null($value)) {
                $result[] = $value;
            }
        }

        return $result;
    }

    /**
     * @param string $columnName
     * @param string $displayName
     * @param bool $fullQuery
     * @return string
     */
    public static function getQueryCases($columnName, $displayName = null, $fullQuery = true) {
        $_queryText = "";
        foreach (self::getConstants() as $id) {
            $_queryText .= " WHEN {$columnName} = {$id} THEN \"" . self::toStringAliasOrKey($id) . "\" ";
        }
        $_queryText .= " ELSE {$columnName} ";

        if ($fullQuery) {
            return " CASE {$_queryText} END AS '" . ($displayName ?: $columnName) . "' ";
        }
        return $_queryText;
    }

    /**
     * Convert integer value to string based on enum, can get a formatter($enum, $value):String function
     *
     * @param int $value
     * @param callable $formatter
     * @return string
     */
    public static function toString($value, callable $formatter = null) {
        if (!self::isValidValue($value)) {
            return "";
        }

        if ($formatter) {
            return $formatter($value);
        } else {
            return self::toStringAliasOrKeyWithValue($value);
        }
    }

    public static function toStringAliasOrKey($value) {
        return self::toString($value, function($value) {
            $_alias = self::getAliasFromValue($value);
            return ($_alias ?: self::getKeysFromValue($value));
        });
    }

    public static function toStringAliasOrKeyWithValue($value) {
        return self::toString($value, function($value) {
            $_alias = self::getAliasFromValue($value);
            return ($_alias ?: self::getKeysFromValue($value)) . " ($value)";
        });
    }
}
