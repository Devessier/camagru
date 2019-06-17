<?php

function transpile_tag_template_literals ($content) {
    return preg_replace_callback(
        '/(?<fn>[^\s`]+)`(?<content>[^`]*)`/',
        function ($matches) {
            [
                'fn' => $fn,
                'content' => $content
            ] = $matches;
    
            $i = 0;
    
            $matches = array_map(function ($match) use (&$i) {
                if ($i++ % 2 === 0) {
                    return preg_replace('/\s+/', ' ', str_replace('\'', '\\\'', $match));
                }
                return $match;
            }, preg_split('/(\$\{\s*)|(\s+\}(?="|>|<))/', $content));
    
            $templates = array_filter($matches, function ($i) {
                return $i % 2 === 0;
            }, ARRAY_FILTER_USE_KEY);
    
            $args = array_filter($matches, function ($i) {
                return $i % 2 !== 0;
            }, ARRAY_FILTER_USE_KEY);
    
            $string = '';
    
            $string .= "$fn([";
    
            $i = 0;
            foreach ($templates as $chunk) {
                $string .= "'$chunk'";
                if ($i++ !== count($templates) - 1) {
                    $string .= ', ';
                }
            }
    
            $string .= "]";
            if (count($args) !== 0) {
                $string .= ", ";
            }
    
            $i = 0;
            foreach ($args as $arg) {
                $string .= "$arg";
                if ($i++ !== count($args) - 1) {
                    $string .= ", ";
                }
            }
    
            return $string .= ");";
        },
        $content
    );
}

function transpile (string $file) {
    $functions = [
        transpile_tag_template_literals
    ];

    return array_reduce($functions, function ($content, $fn) {
        return $fn($content);
    }, $file);
}
